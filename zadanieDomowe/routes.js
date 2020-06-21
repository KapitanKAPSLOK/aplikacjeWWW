"use strict";
//import { Session } from "inspector";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Do prawidłowego działania aplikacji potrzebna jest baza danych "bazaMemy.db".
Jeśli nie istnieje można ją stworzyć odpalając plik zakladaczBazy.js.
*/
var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var csrfProtection = csurf({ cookie: true });
const baza_1 = require("./bazy_danych/baza");
let db = baza_1.Baza.get();
// db.getNajlepsi('Mix', 3).then((w)=>{
//     console.log(w);
// })
router.post('/login', function (req, res) {
    db.getUser(req.body.login, req.body.password).then((u) => {
        if (u) {
            //podany login i hasło pasują do jednego z użytkowników bazy
            req.session.user = u;
        }
        res.redirect("/");
    });
});
//sprawdzanie czy użytkownik jest zalogowany
router.use(function (req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.sendFile(__dirname + "/public/login.html");
    }
});
router.get('/quizData', function (req, res) {
    let quiz = req.session.quiz;
    if (quiz) {
        db.getQuizInfo(quiz).then((wstep) => {
            db.getPytania(quiz).then((pytania) => {
                if (pytania) {
                    //zapisywanie czasu wysłania quizu
                    req.session.start = new Date().getTime();
                    res.json({
                        "nazwa": quiz,
                        "wstep": wstep,
                        "pytania": pytania
                    });
                }
            });
        });
    }
});
router.post('/quizData', function (req, res) {
    if (req.session.quiz) {
        //zapisywanie czasu rozwiązywania quizu
        let czas = new Date().getTime() - req.session.start;
        //ściąganie poprawnych odpowiedzi z bazy
        db.getOdpowiedzi(req.session.quiz).then((odp) => {
            if (odp) {
                //wynikiem jest czas wypełniania quizu + kary za błędne odpowedzi
                let wynik = czas;
                //zmienna ze statystykami dla bazy danych
                let statystyki = new Array(odp.length);
                for (let i = 0; i < odp.length; ++i) {
                    if (req.body['pytanie' + (i + 1)] != odp[i].odpowiedz)
                        wynik += odp[i].kara * 1000;
                    //przygotowywanie rekordu do bazy danych
                    statystyki.push({
                        "id": odp[i].id,
                        "odpowiedz": req.body['pytanie' + (i + 1)],
                        "czas": req.body['pytanie' + (i + 1) + 'czas'] / 100 * czas
                    });
                }
                db.dodajWynik(req.session.user, req.session.quiz, wynik, statystyki);
                let q = req.session.quiz;
                delete (req.session.quiz);
                res.redirect('/statystyki/' + q);
            }
        });
    }
});
router.post('/quiz', function (req, res) {
    req.session.quiz = req.body.rodzaj;
    if (req.session.quiz) {
        db.getWynik(req.session.user, req.session.quiz).then(row => {
            console.log(row);
            if (!row)
                res.sendFile(__dirname + '/public/quiz.html');
            else {
                //quiz został już rozwiązany
                res.sendFile(__dirname + '/public/indexErr.html');
            }
        });
    }
    else {
        res.redirect("/");
    }
});
//renderowanie strony głównej
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
router.get('/logout', function (req, res) {
    delete (req.session.user);
    res.redirect("/");
});
//wyświetla listę quizów wraz z wynikami uzyskanymi przez użytkownika
router.get('/statystyki', function (req, res) {
    let statystyki;
    db.getWyniki(req.session.user).then((statystyki) => {
        res.render('statystyki', { user: req.session.user, statystyki: statystyki });
    });
});
//wyświetla statystyki dotyczące rozwiązania konkretnego quizu
router.get('/statystyki/:q', function (req, res) {
    // let obietnice:[Promise<{ odp: number, pop: number, czas: number, sr: number }[] | null>,
    // Promise<{nazwa:string, wynik:number}[] | null>]
    // =[db.getStatystyki(req.session.user, req.params.q), db.getNajlepsi(req.session.user, 3)];
    Promise.all([db.getStatystyki(req.session.user, req.params.q), db.getNajlepsi(req.params.q, 3)])
        .then(data => {
        res.render('statystykiQuiz', { user: req.session.user, statystyki: data[0],
            nazwa: req.params.q, najlepsi: data[1] });
    });
});
module.exports = router;
