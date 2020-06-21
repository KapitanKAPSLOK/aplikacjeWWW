"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Tworzy bazę danych oraz umieszcza w niej memy.
*/
const baza_1 = require("./baza");
//let Baza=require('./baza');
async function makeDatabase() {
    let db = baza_1.Baza.get();
    await db.create();
    //dodawanie kont użytkowników
    db.dodajUzytkownika("user1", "user1");
    db.dodajUzytkownika("user2", "user2");
    //dodawanie quizów do bazy
    db.dodajQuiz({
        "nazwa": "Mix",
        "wstep": "Liczyć każdy może.",
        "pytania": [
            { "tresc": "2+2=", "odpowiedz": 4, "kara": 4 },
            { "tresc": "2+3=", "odpowiedz": 5, "kara": 4 },
            { "tresc": "2-(-24:4)=", "odpowiedz": 8, "kara": 10 }
        ]
    });
    db.dodajQuiz({
        "nazwa": "Dodawanie",
        "wstep": "Liczyć każdy może.",
        "pytania": [
            { "tresc": "2+0=", "odpowiedz": 2, "kara": 4 },
            { "tresc": "2+3+9=", "odpowiedz": 14, "kara": 6 },
            { "tresc": "-2+(-6)=", "odpowiedz": -8, "kara": 5 },
            { "tresc": "-2+6=", "odpowiedz": 4, "kara": 5 }
        ]
    });
    db.dodajQuiz({
        "nazwa": "Odejmowanie",
        "wstep": "Odejmować każdy może.",
        "pytania": [
            { "tresc": "0-2=", "odpowiedz": -2, "kara": 4 },
            { "tresc": "2-3-9=", "odpowiedz": -10, "kara": 6 },
            { "tresc": "-2-6=", "odpowiedz": -10, "kara": 5 },
            { "tresc": "144-17=", "odpowiedz": 127, "kara": 6 },
            { "tresc": "139-17-26=", "odpowiedz": 96, "kara": 10 }
        ]
    });
    db.dodajQuiz({
        "nazwa": "Mnożenie",
        "wstep": "Liczyć każdy może.",
        "pytania": [
            { "tresc": "0*2=", "odpowiedz": 0, "kara": 3 },
            { "tresc": "2*3*9=", "odpowiedz": 54, "kara": 7 },
            { "tresc": "2*(-2)=", "odpowiedz": -4, "kara": 4 },
            { "tresc": "-4*(-6)=", "odpowiedz": 24, "kara": 6 }
        ]
    });
}
makeDatabase();
