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
sqlite3.verbose();
//klasa przechowująca informację o pojedynczym memie w raz z jego historią cen
class Meme {
    constructor(id, name, url, price = 0) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.price = price;
    }
    async changePrice(p) {
        await Baza.get().changePrice(this.id, p);
    }
}
exports.Meme = Meme;
Meme.ileMemow = 0;
//Singleton do obsługi operacji na bazie memów
class Baza {
    constructor() {
        this.db = new sqlite3.Database('bazaMemy.db');
    }
    //tworzenie tabel bazy
    async create() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS memy (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name VARCHAR(127),
                url VARCHAR(511),
                price INT
                );`).run(`CREATE TABLE IF NOT EXISTS ceny (
                id INTEGER REFERENCES memy(id), 
                price INT,
                change_date DATETIME
                );`, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    static get() {
        if (!Baza.instance) {
            Baza.instance = new Baza();
        }
        return Baza.instance;
    }
    dodajMema(name, url, price) {
        this.db.serialize(() => {
            this.db.run('BEGIN TRANSACTION')
                .run('INSERT INTO memy(name, url, price) VALUES(?, ?, ?)', [name, url, price])
                .run('INSERT INTO ceny VALUES (last_insert_rowid(), ?, CURRENT_TIMESTAMP)', [price])
                .run('COMMIT');
        });
    }
    async getMeme(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, name, url, price FROM memy WHERE id= ?;', [id], (err, row) => {
                if (err)
                    reject(err);
                if (row) {
                    resolve(new Meme(row.id, row.name, new URL(row.url), row.price));
                }
                resolve(null);
            });
        });
    }
    //funkcja wyszukuje w bazie danych [ile] memów o najwyższej cenie
    async najdrozsze(ile) {
        let naj = new Array();
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM 
            (SELECT ROW_NUMBER () OVER ( ORDER BY price DESC) nr, id, name, url, price FROM memy) 
            WHERE nr <=?;`, [ile], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows) {
                    rows.forEach((row) => {
                        naj.push(new Meme(row.id, row.name, new URL(row.url), row.price));
                    });
                }
                resolve(naj);
            });
        });
    }
    async historiaCen(id) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT price FROM ceny WHERE id=? ORDER BY change_date DESC;', [id], (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows);
            });
        });
    }
    async changePrice(id, price) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION')
                    .run('UPDATE memy SET price= ? WHERE id= ?', [price, id])
                    .run('INSERT INTO ceny VALUES (?, ?, CURRENT_TIMESTAMP)', [id, price])
                    .run('COMMIT', (err, rows) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        });
    }
}
exports.Baza = Baza;
