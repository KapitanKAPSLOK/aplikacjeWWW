import * as sqlite3 from 'sqlite3';
//komunikaty o błędach bazy
sqlite3.verbose();
//klasa przechowująca informację o pojedynczym memie w raz z jego historią cen
//Singleton do obsługi operacji na bazie danych
export class Baza {
    constructor() {
        this.db = new sqlite3.Database('baza.db');
    }
    //tworzenie tabel bazy
    async create() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`CREATE TABLE IF NOT EXISTS quizy (
                        nazwa VARCHAR(127) PRIMARY KEY,
                        wstep VARCHAR(511),
                    );`)
                    .run(`CREATE TABLE IF NOT EXISTS pytania (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        quiz VARCHAR(127) REFERENCES quizy(nazwa),
                        tresc VARCHAR(511),
                        odpowiedz INTEGER,
                        kara REAL
                    );`)
                    .run(`CREATE TABLE IF NOT EXISTS users(
                        login VARCHAR(63) PRIMARY KEY,
                        haslo VARCHAR(63)
                    )`)
                    .run(`CREATE TABLE IF NOT EXISTS wyniki(
                        login VARCHAR(63) REFERENCES users(login),
                        quiz VARCHAR(127) REFERENCES quizy(nazwa),
                        wynik REAL,
                        PRIMARY KEY(login, quiz)
                    )`).
                    run(`CREATE TABLE IF NOT EXISTS statystyki(
                        login VARCHAR(63) REFERENCES wyniki(login),
                        id_pytanie INTEGER REFERENCES pytania(id),
                        czas REAL,
                        odpowiedz INTEGER,
                        PRIMARY KEY(login, id_pytania)
                    )`, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    static get() {
        if (!Baza.instance) {
            Baza.instance = new Baza();
        }
        return Baza.instance;
    }
    dodajWynik(login, quiz, wynik, odpowiedzi) {
        this.db.serialize(() => {
            this.db.run('BEGIN TRANSACTION')
                .run('INSERT INTO wyniki VALUES (?, ?, ?)', [login, quiz, wynik]);
            odpowiedzi.forEach(e => {
                this.db.run('INSERT INTO statystyki VALUES (?, ?, ?, ?)', [login, e.id, e.czas, e.odpowiedz]);
            });
            this.db.run('COMMIT');
        });
    }
    dodajUzytkownika(login, haslo) {
        if (login.length <= 63 && haslo.length <= 63) //63- maksymalna długość loginu i hasła
            this.db.run('INSERT INTO users VALUES (?, ?)', [login, haslo]);
    }
    async getUser(login, haslo) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT login FROM users WHERE login= ? && haslo= ?;', [login, haslo], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(name);
                }
                //nieprawidłowe dane logowania
                resolve(null);
            });
        });
    }
    async getPytania(name) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, tresc, odpowiedz, kara FROM pytania WHERE nazwa= ?', [name], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
    async getQuizList() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT nazwa FROM quizy', [], (err, rows) => {
                if (err)
                    reject(err);
                if (rows) {
                    resolve(rows);
                }
                resolve([]);
            });
        });
    }
    async getQuizInfo(name) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT opis FROM quizy WHERE nazwa= ?', [name], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
    async getOdpowiedziId(name) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, odpowiedz, kara FROM pytania WHERE nazwa= ?', [name], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
}
