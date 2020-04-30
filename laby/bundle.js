(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//klasa generująca liczby fibonacciego
class Fibonacci {
    constructor() {
        this.fib1 = 0;
        this.fib2 = 1;
    }
    nextFib() {
        const temp = this.fib2;
        this.fib2 = this.fib1 + this.fib2;
        this.fib1 = temp;
        return this.fib1;
    }
    fib(n) {
        let a = 0;
        let b = 1;
        let c = 0;
        for (let i = 0; i < n; ++i) {
            c = b;
            b = a + b;
            a = c;
        }
        return c;
    }
}
exports.Fibonacci = Fibonacci;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fib_1 = require("./fib");
const nowyAkapit = document.createElement("p");
nowyAkapit.innerHTML = "Nowy akapit.";
nowyAkapit.style.backgroundColor = "rgb(100,100,100)";
const body = document.querySelector("body");
if (body != null)
    body.appendChild(nowyAkapit);
const lista = document.querySelectorAll("#contDaneLotu > aside > ol > li");
let najwiekszyPasazer = lista[0];
if (najwiekszyPasazer != null && lista != null) {
    lista.forEach(element => {
        if (najwiekszyPasazer.getAttribute("data-identyfikator-pasazera") <
            element.getAttribute("data-identyfikator-pasazera")) {
            najwiekszyPasazer = element;
        }
    });
    const id = najwiekszyPasazer.getAttribute("data-identyfikator-pasazera");
    console.log(id);
}
setTimeout(() => {
    console.log("No już wreszcie.");
}, 2000);
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// zmienianie koloru tła
const kolory = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];
async function teczoweKolory(el) {
    for (let i = 0; i < 7; ++i) {
        await delay(1000);
        el.style.backgroundColor = kolory[i];
    }
}
teczoweKolory(body);
// wyświetlanie zdjęcia autora ostatniego commita w typescripcie
fetch(' https://api.github.com/repos/Microsoft/TypeScript/commits')
    .then(res => res.json())
    .then(dataRes => {
    const zdj = document.createElement("img");
    zdj.src = dataRes[0].author.avatar_url;
    if (body != null)
        body.appendChild(zdj);
})
    .catch(err => console.error(err));
const aside = document.querySelector("#contListaLotow > aside");
const grid = document.querySelector("#contListaLotow");
if (grid != null)
    grid.onclick = (event) => {
        if (aside.contains(event.target))
            changeColor(aside);
    };
// tworzenie ciągu liczb fibbonacciego
const fib = new fib_1.Fibonacci();
function changeColor(el) {
    if (el === null)
        return;
    if (el.style.backgroundColor === 'green')
        el.style.backgroundColor = 'blue';
    else if (el.style.backgroundColor === 'blue')
        el.style.backgroundColor = 'green';
    else
        el.style.backgroundColor = 'green';
    for (let i = 0; i < 9; ++i) {
        fib.nextFib();
    }
    console.log(fib.nextFib());
}
const formularz = document.getElementById("rezerwacjaForm");
// kliknięcie w obszar formularza nie powinno zmieniać koloru
if (formularz != null)
    formularz.onclick = (event) => {
        event.stopPropagation();
    };
const imie = document.querySelector("input[name=imie]");
const nazwisko = document.querySelector("input[name=nazwisko]");
const data = document.querySelector("input[name=data]");
const submit = document.querySelector("input[type=submit]");
const skad = document.getElementById("skad");
const dokad = document.getElementById("dokad");
if (submit != null && (imie.value === "" || nazwisko.value === "" ||
    data.valueAsDate < new Date())) {
    submit.classList.add('hidden');
}
formularz.oninput = () => {
    if (imie.value !== "" && nazwisko.value !== "" && data.valueAsDate >= new Date())
        submit.classList.remove("hidden");
    else
        submit.classList.add('hidden');
};
const potwierdzenie = document.getElementById("okienko");
potwierdzenie.style.display = "none";
// pokazywanie okienka o udanej rezerwacji
formularz.onsubmit = (event) => {
    potwierdzenie.style.display = null;
    const tekst = document.createElement("h1");
    tekst.innerText = "Zarezerwowano lot z " + skad.value + " do " +
        dokad.value + " dla pasażera: " + imie.value + " " + nazwisko.value + ".";
    potwierdzenie.innerText = null;
    potwierdzenie.appendChild(tekst);
    event.preventDefault();
};
body.onclick = () => potwierdzenie.style.display = "none";

},{"./fib":1}]},{},[2]);
