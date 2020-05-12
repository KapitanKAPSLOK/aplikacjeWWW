import {createServer} from 'http';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import {promisify} from 'util';

function wpiszDane(nazwa:string) {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('INSERT INTO wyswietlenia (sciezka, liczba) VALUES ("'+nazwa+'", 1);');
    db.close();
}

let server = createServer(
    (req, res) => {
        if(req.url==="/statystyki"){
            sqlite3.verbose();
            let db = new sqlite3.Database('baza.db');
            db.all('SELECT sciezka, liczba FROM wyswietlenia;', [], (err, rows) => {
                if (err) throw(err);
                for(let {sciezka, liczba} of rows) {
                    res.write(sciezka + '->' + liczba+"\n");
                }
            db.close();
            res.end();
            });
        }else{
            let open=promisify(fs.readFile);
            open(req.url.substr(1)).then((file)=>{
                //wypisywanie zawartości pliku
                res.write(file)
                //zapisywanie w bazie kolejnego odwołania do pliku
                let db = new sqlite3.Database('baza.db');
                db.get('SELECT sciezka, liczba FROM wyswietlenia WHERE sciezka="'+
                req.url.substr(1)+'";',(err,result)=>{
                    if (err) throw(err);
                    if(result==null){
                        //brak rekordu w bazie, dodawanie ścieżki
                        wpiszDane(req.url.substr(1));
                        res.end();  
                    }else{
                        //zwiększanie licznika odwiedzin o 1
                        db.run('UPDATE wyswietlenia SET liczba='+String(result.liczba+1)+
                        ' WHERE sciezka="'+req.url.substr(1)+'";',(status,err)=>{
                            if(err)throw(err);
                            res.end();  
                        });
                    }  
                });
            }).catch((err:Error)=>{
                res.end();
            });
        }
    }
);

server.listen(8080);

