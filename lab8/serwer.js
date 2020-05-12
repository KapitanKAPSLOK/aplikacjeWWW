import { createServer } from 'http';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import { promisify } from 'util';
function wpiszDane(nazwa) {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('INSERT INTO wyswietlenia (sciezka, liczba) VALUES ("' + nazwa + '", 1);');
    db.close();
}
let server = createServer((req, res) => {
    if (req.url === "/statystyki") {
        sqlite3.verbose();
        let db = new sqlite3.Database('baza.db');
        db.all('SELECT sciezka, liczba FROM wyswietlenia;', [], (err, rows) => {
            if (err)
                throw (err);
            for (let { sciezka, liczba } of rows) {
                res.write(sciezka + '->' + liczba + "\n");
            }
            db.close();
            res.end();
        });
    }
    else {
        let open = promisify(fs.open);
        open(req.url, 'r').then((file) => {
            res.write("tak");
            res.end();
        }).catch((err) => { res.write("nie"); }).then(() => res.end());
    }
});
server.listen(8080);
