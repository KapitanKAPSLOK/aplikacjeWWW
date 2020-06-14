/*
Do prawidłowego działania aplikacji potrzebna jest baza danych "bazaMemy.db".
Jeśli nie istnieje można ją stworzyć odpalając plik zakladaczBazy.js.
*/
var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var csrfProtection = csurf({ cookie: true });

import {Baza,Meme} from '../public/javascripts/BazaMemow';
let db=Baza.get();

//renderowanie strony głównej
router.get('/', function(req, res) {
    db.najdrozsze(3).then(naj=>{
        res.render('index', { title: 'Meme market', message: 'Hello there!', 
        memes: naj, views: req.session.views, user: req.session.user})
    })  
});

//strony poszczególnych memów z historią ich cen
router.get('/meme/:memeId', csrfProtection, function (req, res) {
    //wczytywanie informacji o memie oraz jego historii cen
    let obietnice: [Promise<Meme>, Promise<{price: Number, user: string | null}[]>]
        =[db.getMeme(req.params.memeId), db.historiaCen(req.params.memeId)];
    Promise.all(obietnice).then(data=>{
        res.render('meme', { meme: data[0], prices: data[1], views: req.session.views,
             csrfToken: req.csrfToken(), user: req.session.user });
    })
 })
 router.post('/meme/:memeId', csrfProtection, function (req, res) {
    //sprawdzenie czy użytkownik zmieniający cenę jest zalogowany
    if(!req.session.user){
        res.redirect('/meme/'+req.params.memeId);
    }
    //zmiana ceny mema
    db.changePrice(req.params.memeId, req.body.price, req.session.user).then(()=>{
        //zmieniamy tylko cenę i pozostajemy na tej samej stronie, a licznik
        //odwiedzonych stron zwiększy się przy tej czynności dwa razy
        req.session.views-=2;
        //przeładowanie strony z ukatualnionymi danymi
        res.redirect('/meme/'+req.params.memeId);
    })
 })
 router.post('/login', function (req, res) {
     req.session.views--;
     db.getUser(req.body.login).then((u)=>{
         console.log(req.body.login);
        req.session.user=u;
        res.redirect("/");
     }) 
 })
 router.get('/logout', function (req, res) {
    req.session.views--;
    delete(req.session.user);
    res.redirect("/");
})

module.exports = router;
