import * as sqlite3 from 'sqlite3';

//komunikaty o błędach bazy
sqlite3.verbose();

//interfejs pojedynczego pytania w quizie
export interface IPytanie{
    tresc: string;
    odpowiedz: number;
    kara: number;
}
//interfejs quizu
export interface IQuiz{
    nazwa: string;
    wstep: string;
    pytania: IPytanie[];
}
//interfejs odpowiedzi do quizu
export interface IOdpowiedzi{
    nazwa: string; //nazwa quizu
    czasCalkowity: Number; //czas rozwiązania quizu wraz z karami
    czas: Number[] | null; //czasy odpowiedzi na kolejne pytania bez kar
}


//klasa przechowująca informację o pojedynczym memie w raz z jego historią cen

//Singleton do obsługi operacji na bazie danych
export class Baza {
    private static instance: Baza;
    db: sqlite3.Database;
    private constructor() {
        this.db = new sqlite3.Database('bazy_danych/baza.db');
    }
    //tworzenie tabel bazy
    public async create() {
        return new Promise((resolve, reject) => {
            this.db.serialize(()=>{
                this.db.run(
                    `CREATE TABLE IF NOT EXISTS quizy (
                        nazwa VARCHAR(127) PRIMARY KEY,
                        wstep VARCHAR(511)
                    )`)
                    .run(
                    `CREATE TABLE IF NOT EXISTS pytania (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        quiz VARCHAR(127) REFERENCES quizy (nazwa),
                        tresc VARCHAR(511),
                        odpowiedz INTEGER,
                        kara REAL
                    )`)
                    .run(
                    `CREATE TABLE IF NOT EXISTS users(
                        login VARCHAR(63) PRIMARY KEY,
                        haslo VARCHAR(63)
                    )`)
                    .run(
                    `CREATE TABLE IF NOT EXISTS wyniki(
                        login VARCHAR(63) REFERENCES users(login),
                        quiz VARCHAR(127) REFERENCES quizy(nazwa),
                        wynik REAL,
                        PRIMARY KEY(login, quiz)
                    )`)
                    .run(
                    `CREATE TABLE IF NOT EXISTS statystyki(
                        login VARCHAR(63) REFERENCES wyniki(login),
                        id_pytanie INTEGER REFERENCES pytania(id),
                        czas REAL,
                        odpowiedz INTEGER,
                        PRIMARY KEY (login, id_pytanie)
                    );`, (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                    
            });
        });
    }
    public static get(): Baza {
        if (!Baza.instance) {
            Baza.instance = new Baza();
        }
        return Baza.instance;
    }
    dodajQuiz(q: IQuiz) {
        this.db.serialize(()=>{
            this.db.run('BEGIN TRANSACTION')
            .run('INSERT INTO quizy VALUES (?, ?)', [q.nazwa, q.wstep]);
            q.pytania.forEach(p => {
                this.db.run('INSERT INTO pytania(quiz, tresc, odpowiedz, kara) VALUES (?, ?, ?, ?)', 
                [q.nazwa, p.tresc, p.odpowiedz, p.kara]);
            });
            this.db.run('COMMIT');
        });
    }
    dodajUzytkownika(login: string, haslo: string){
        if(login.length<=63 && haslo.length<=63) //63- maksymalna długość loginu i hasła
            this.db.run('INSERT INTO users VALUES (?, ?)', [login, haslo]);
    }
    dodajWynik(login: string, quiz: string, wynik: number, odpowiedzi: {id: number, odpowiedz: number, czas: number}[]) {
        this.db.serialize(()=>{
            this.db.run('BEGIN TRANSACTION')
            .run('INSERT INTO wyniki VALUES (?, ?, ?)', [login, quiz, wynik]);
            odpowiedzi.forEach(e => {
                this.db.run('INSERT INTO statystyki VALUES (?, ?, ?, ?)', [login, e.id, e.czas, e.odpowiedz]);
            });
            this.db.run('COMMIT');
        })
    }
    async getUser(login: string, haslo: string){
        return new Promise((resolve, reject) => {
            this.db.get('SELECT login FROM users WHERE login= ? && haslo= ?;', [login, haslo], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(name);
                }
                //nieprawidłowe dane logowania
                resolve(null);
            })
        })
    }
    async getPytania(name: string): Promise<IPytanie[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT tresc, odpowiedz, kara FROM pytania WHERE quiz= ? ORDER BY id', [name], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            })
        })
    }
    async getQuizList(): Promise<string[]>{
        return new Promise((resolve, reject) => {
            this.db.all('SELECT nazwa FROM quizy', [], (err, rows) => {
                if (err) reject(err);
                if (rows) {
                    resolve(rows);
                }
                resolve([]);
            })
        })
    }
    async getQuizInfo(name: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT wstep FROM quizy WHERE nazwa= ?', [name], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(row.wstep);
                }
                resolve(null);
            })
        })
    }
    async getOdpowiedziId(name: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, odpowiedz, kara FROM pytania WHERE nazwa= ?', [name], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            })
        })
    }
}