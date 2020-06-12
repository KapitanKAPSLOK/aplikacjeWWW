import * as sqlite3 from 'sqlite3';
import { resolve } from 'dns';
sqlite3.verbose();

//klasa przechowująca informację o pojedynczym memie w raz z jego historią cen
export class Meme {
    id: number;
    name: string;
    url: URL;
    price: number;
    static ileMemow = 0;
    constructor(id: number, name: string, url: URL, price: number = 0) {
        this.id = id;
        this.name = name
        this.url = url;
        this.price = price;
    }
    async changePrice(p: number) {
        await Baza.get().changePrice(this.id, p);
    }
}

//Singleton do obsługi operacji na bazie memów
export class Baza {
    private static instance: Baza;
    db: sqlite3.Database;
    private constructor() {
        this.db = new sqlite3.Database('bazaMemy.db');
    }
    //tworzenie tabel bazy
    public async create() {
        return new Promise((resolve, reject) => {
            this.db.run(
                `CREATE TABLE IF NOT EXISTS memy (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name VARCHAR(127),
                url VARCHAR(511),
                price INT
                );`).run(
                    `CREATE TABLE IF NOT EXISTS ceny (
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
    public static get(): Baza {
        if (!Baza.instance) {
            Baza.instance = new Baza();
        }
        return Baza.instance;
    }
    dodajMema(name: string, url: string, price: number) {
        this.db.serialize(()=>{
            this.db.run('BEGIN TRANSACTION')
            .run('INSERT INTO memy(name, url, price) VALUES(?, ?, ?)', [name, url, price])
            .run('INSERT INTO ceny VALUES (last_insert_rowid(), ?, CURRENT_TIMESTAMP)', [price])
            .run('COMMIT')
        })
    }
    async getMeme(id: number): Promise<Meme> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id, name, url, price FROM memy WHERE id= ?;', [id], (err, row) => {
                if (err) reject(err);
                if (row) {
                    resolve(new Meme(row.id, row.name, new URL(row.url), row.price));
                }
                resolve(null);
            })
        })
    }
    //funkcja wyszukuje w bazie danych [ile] memów o najwyższej cenie
    async najdrozsze(ile: number): Promise<Meme[]> {
        let naj = new Array<Meme>();
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
            })
        });
    }
    async historiaCen(id: number): Promise<Number[]> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT price FROM ceny WHERE id=? ORDER BY change_date DESC;', [id], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        })
    }
    async changePrice(id: number, price: number) {
        return new Promise((resolve, reject) => {
            this.db.serialize(()=>{
                this.db.run('BEGIN TRANSACTION')
                .run('UPDATE memy SET price= ? WHERE id= ?', [price, id])
                .run('INSERT INTO ceny VALUES (?, ?, CURRENT_TIMESTAMP)', [id, price])
                .run('COMMIT',(err, rows) => {
                   if (err) reject(err);
                   resolve();
                })
            })
        })
    }
}