//import { Session } from "inspector";
/*
Do prawidłowego działania aplikacji potrzebna jest baza danych "bazaMemy.db".
Jeśli nie istnieje można ją stworzyć odpalając plik zakladaczBazy.js.
*/
var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var csrfProtection = csurf({ cookie: true });
//import {Baza} from './baza';
//let db=Baza.get();
//renderowanie strony głównej
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    //res.send("asdasd");
});
router.post('/quiz', function (req, res) {
    req.session.quiz = req.body.rodzaj;
    if (req.session.quiz)
        res.sendFile(__dirname + '/public/quiz.html');
    else
        res.redirect("/");
});
router.get('/quizData', function (req, res) {
    console.log(req.session.quiz);
    res.json(JSON.parse(`{
        "nazwa": "Mnozenie",
        "wstep": "Liczyć każdy może.",
        "pytania":[
            {"tresc": "0*2=", "odpowiedz": 0, "kara": 3},
            {"tresc": "2*3*9=", "odpowiedz": 54, "kara": 7},
            {"tresc": "2*(-2)=", "odpowiedz": -4, "kara": 4},
            {"tresc": "-4*(-6)=", "odpowiedz": 24, "kara": 6}
        ]
    }`));
});
router.post('/login', function (req, res) {
    //console.log(req.body.login);
    //req.session.user=u;
    res.redirect("/");
});
router.get('/logout', function (req, res) {
    delete (req.session.user);
    res.redirect("/");
});
module.exports = router;
