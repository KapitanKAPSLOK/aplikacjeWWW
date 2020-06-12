/*
Do prawidłowego działania aplikacji potrzebna jest baza danych "bazaMemy.db".
Jeśli nie istnieje można ją stworzyć odpalając plik zakladaczBazy.js.
*/
var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var csrfProtection = csurf();

import {Baza,Meme} from '../public/javascripts/BazaMemow';
let db=Baza.get();


// db.najdrozsze(4).then(v=>{
//     v.forEach(element => {
//         console.log(element.name);
//         console.log(element.price);
//     });
// })

//renderowanie strony głównej
router.get('/', function(req, res) {
    db.najdrozsze(3).then(naj=>{
        res.render('index', { title: 'Meme market', message: 'Hello there!', 
        memes: naj})
    })  
});

//strony poszczególnych memów z historią ich cen
router.get('/meme/:memeId', function (req, res) {
    //wczytywanie informacji o memie oraz jego historii cen
    let obietnice: [Promise<Meme>, Promise<Number[]>]=[db.getMeme(req.params.memeId), db.historiaCen(req.params.memeId)];
    Promise.all(obietnice).then(data=>{
        res.render('meme', { meme: data[0], prices: data[1]});
    })
 })
 router.post('/meme/:memeId', function (req, res) {
    //zmiana ceny mema
    db.changePrice(req.params.memeId, req.body.price).then(()=>{
        //przeładowanie strony z ukatualnionymi danymi
        Promise.all([db.getMeme(req.params.memeId), db.historiaCen(req.params.memeId)]).then(data=>{
            res.render('meme', { meme: data[0], prices: data[1]});
        })
    })
 })

module.exports = router;
