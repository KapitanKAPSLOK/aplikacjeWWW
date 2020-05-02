////quizy w formacie JSON////

let bazaQuizow:string[]=new Array(2);

//quiz z mieszanymi pytaniami
bazaQuizow[0]=`{
    "nazwa": "Mix",
    "pytania":[
        {"tresc": "2+2=", "odpowiedz": 4, "kara": 4},
        {"tresc": "2+3=", "odpowiedz": 5, "kara": 4},
        {"tresc": "2-(-24:4)=", "odpowiedz": 8, "kara": 10}
    ]
}`;
//quiz o dodawaniu
bazaQuizow[1]=`{
    "nazwa": "Dodawanie",
    "pytania":[
        {"tresc": "2+0=", "odpowiedz": 2, "kara": 4},
        {"tresc": "2+3+9=", "odpowiedz": 14, "kara": 6},
        {"tresc": "-2-6=", "odpowiedz": -10, "kara": 5},
        {"tresc": "-2+6=", "odpowiedz": 4, "kara": 5}
    ]
}`;

//interfejs pojedynczego pytania w quizie
export interface IPytanie{
    tresc: string;
    odpowiedz: number;
    kara: number;
}
//interfejs quizu
export interface IQuiz{
    nazwa: string;
    pytania: IPytanie[];
}

const form=document.getElementById("rodzajQuizu") as HTMLFormElement;
let rodzaj=document.getElementById("rodzaj") as HTMLInputElement;

form.onsubmit=function(){
    sessionStorage.setItem("wybor",bazaQuizow[Number(rodzaj.value)]);
    return true;
}
