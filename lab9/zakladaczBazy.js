"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Tworzy bazę danych oraz umieszcza w niej memy.
*/
const BazaMemow_1 = require("./public/javascripts/BazaMemow");
async function makeDatabaseOfMemes() {
    let db = BazaMemow_1.Baza.get();
    await db.create();
    db.dodajMema('Elite', 'https://i.imgflip.com/30zz5g.jpg', 1200);
    db.dodajMema('Platinum', 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', 1100);
    db.dodajMema('Gold', 'https://i.redd.it/h7rplf9jt8y21.png', 1000);
    db.dodajUzytkownika('user_1');
    db.dodajUzytkownika('user_2');
    db.dodajUzytkownika('przegladaczMemow');
}
makeDatabaseOfMemes();
