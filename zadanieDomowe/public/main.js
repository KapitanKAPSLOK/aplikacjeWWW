////quizy w formacie JSON////
let bazaQuizow = new Array(2);
//quiz z mieszanymi pytaniami
bazaQuizow[0] = `{
    "nazwa": "Mix",
    "wstep": "Liczyć każdy może.",
    "pytania":[
        {"tresc": "2+2=", "odpowiedz": 4, "kara": 4},
        {"tresc": "2+3=", "odpowiedz": 5, "kara": 4},
        {"tresc": "2-(-24:4)=", "odpowiedz": 8, "kara": 10}
    ]
}`;
//quiz o dodawaniu
bazaQuizow[1] = `{
    "nazwa": "Dodawanie",
    "wstep": "Liczyć każdy może.",
    "pytania":[
        {"tresc": "2+0=", "odpowiedz": 2, "kara": 4},
        {"tresc": "2+3+9=", "odpowiedz": 14, "kara": 6},
        {"tresc": "-2+(-6)=", "odpowiedz": -8, "kara": 5},
        {"tresc": "-2+6=", "odpowiedz": 4, "kara": 5}
    ]
}`;
//quiz o odejmowaniu
bazaQuizow[2] = `{
    "nazwa": "Odejmowanie",
    "wstep": "Odejmować każdy może.",
    "pytania":[
        {"tresc": "0-2=", "odpowiedz": -2, "kara": 4},
        {"tresc": "2-3-9=", "odpowiedz": -10, "kara": 6},
        {"tresc": "-2-6=", "odpowiedz": -10, "kara": 5},
        {"tresc": "144-17=", "odpowiedz": 127, "kara": 6},
        {"tresc": "139-17-26=", "odpowiedz": 96, "kara": 10}
    ]
}`;
//quiz o mnożeniu
bazaQuizow[3] = `{
    "nazwa": "Mnozenie",
    "wstep": "Liczyć każdy może.",
    "pytania":[
        {"tresc": "0*2=", "odpowiedz": 0, "kara": 3},
        {"tresc": "2*3*9=", "odpowiedz": 54, "kara": 7},
        {"tresc": "2*(-2)=", "odpowiedz": -4, "kara": 4},
        {"tresc": "-4*(-6)=", "odpowiedz": 24, "kara": 6}
    ]
}`;
const form = document.getElementById("rodzajQuizu");
let rodzaj = document.getElementById("rodzaj");
form.onsubmit = function () {
    sessionStorage.setItem("wybor", bazaQuizow[Number(rodzaj.value)]);
    return true;
};
