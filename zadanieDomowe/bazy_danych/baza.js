"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = __importStar(require("sqlite3"));
//komunikaty o błędach bazy
sqlite3.verbose();
//klasa przechowująca informację o pojedynczym memie w raz z jego historią cen
//Singleton do obsługi operacji na bazie danych
class Baza {
    constructor() {
        this.db = new sqlite3.Database('bazy_danych/baza.db');
    }
    //tworzenie tabel bazy
    async create() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`CREATE TABLE IF NOT EXISTS quizy (
                        nazwa VARCHAR(127) PRIMARY KEY,
                        wstep VARCHAR(511)
                    )`)
                    .run(`CREATE TABLE IF NOT EXISTS pytania (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        quiz VARCHAR(127) REFERENCES quizy (nazwa),
                        tresc VARCHAR(511),
                        odpowiedz INTEGER,
                        kara REAL
                    )`)
                    .run(`CREATE TABLE IF NOT EXISTS users(
                        login VARCHAR(63) PRIMARY KEY,
                        haslo VARCHAR(63)
                    )`)
                    .run(`CREATE TABLE IF NOT EXISTS wyniki(
                        login VARCHAR(63) REFERENCES users(login),
                        quiz VARCHAR(127) REFERENCES quizy(nazwa),
                        wynik REAL,
                        PRIMARY KEY(login, quiz)
                    )`)
                    .run(`CREATE TABLE IF NOT EXISTS statystyki(
                        login VARCHAR(63) REFERENCES wyniki(login),
                        id_pytania INTEGER REFERENCES pytania(id),
                        czas REAL,
                        odpowiedz INTEGER,
                        PRIMARY KEY (login, id_pytania)
                    );`, (err) => {
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
    dodajQuiz(q) {
        this.db.serialize(() => {
            this.db.run('BEGIN TRANSACTION')
                .run('INSERT INTO quizy VALUES (?, ?)', [q.nazwa, q.wstep]);
            q.pytania.forEach(p => {
                this.db.run('INSERT INTO pytania(quiz, tresc, odpowiedz, kara) VALUES (?, ?, ?, ?)', [q.nazwa, p.tresc, p.odpowiedz, p.kara]);
            });
            this.db.run('COMMIT');
        });
    }
    dodajUzytkownika(login, haslo) {
        if (login.length <= 63 && haslo.length <= 63) //63- maksymalna długość loginu i hasła
            this.db.run('INSERT INTO users VALUES (?, ?)', [login, haslo]);
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
    async getUser(login, haslo) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT login FROM users WHERE login= ? AND haslo= ?;', [login, haslo], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row.login);
                }
                //nieprawidłowe dane logowania
                resolve(null);
            });
        });
    }
    async getPytania(name) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT tresc, odpowiedz, kara FROM pytania WHERE quiz= ? ORDER BY id', [name], (err, row) => {
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
            this.db.get('SELECT wstep FROM quizy WHERE nazwa= ?', [name], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row.wstep);
                }
                resolve(null);
            });
        });
    }
    async getOdpowiedzi(name) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, odpowiedz, kara FROM pytania WHERE quiz= ? ORDER BY id', [name], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
    async getWyniki(name) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT nazwa, wynik FROM quizy LEFT JOIN
            (SELECT quiz, wynik FROM wyniki WHERE login = ?) ON nazwa=quiz`, [name], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
    async getWynik(login, quiz) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM wyniki WHERE login = ? AND quiz=?`, [login, quiz], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
    /*
    Funkcja zwraca statystyki konkretnego użytkownika o quizie (odpowiedzi i czas ich rozwiązywania).
    Zwraca też poprawne odpowiedzi oraz średni czas jaki zajmuje rozwiązanie każdego pytania.
    */
    async getStatystyki(login, quiz) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT odp, pop, czas, sr
             FROM (
                 SELECT id, pytania.odpowiedz pop, statystyki.odpowiedz odp, czas
                 FROM pytania LEFT JOIN statystyki ON id=id_pytania
                 WHERE login=? AND quiz=? 
             ) AS a LEFT JOIN (
                 SELECT id_pytania, AVG(czas) sr FROM statystyki GROUP BY id_pytania
             ) ON id=id_pytania ORDER BY id`, [login, quiz], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(row);
                }
                resolve(null);
            });
        });
    }
    async getNajlepsi(quiz, ile) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT login, wynik FROM (SELECT ROW_NUMBER () OVER ( ORDER BY wynik) nr, login, wynik 
            FROM wyniki WHERE quiz=?) WHERE nr<=?`, [quiz, ile], (err, row) => {
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
exports.Baza = Baza;
