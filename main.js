"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let el = document.querySelector("input[name=imie]");
let nowyAkapit = document.createElement("p");
nowyAkapit.innerHTML = "Nowy akapit.";
nowyAkapit.style.backgroundColor = "rgb(100,100,100)";
let body = document.querySelector("body");
if (body != null)
    body.appendChild(nowyAkapit);
let lista = document.querySelectorAll("#contDaneLotu > aside > ol > li");
let najwiekszyPasazer = lista[0];
if (najwiekszyPasazer != null && lista != null) {
    lista.forEach(element => {
        if (najwiekszyPasazer.getAttribute("data-identyfikator-pasazera") <
            element.getAttribute("data-identyfikator-pasazera")) {
            najwiekszyPasazer = element;
        }
    });
    let id = najwiekszyPasazer.getAttribute("data-identyfikator-pasazera");
    console.log(id);
}
setTimeout(() => {
    console.log("No już wreszcie.");
}, 2000);
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let kolory = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];
function teczoweKolory(el) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 7; ++i) {
            yield delay(1000);
            el.style.backgroundColor = kolory[i];
        }
    });
}
teczoweKolory(body);
fetch(' https://api.github.com/repos/Microsoft/TypeScript/commits')
    .then(res => res.json())
    .then(data => {
    const zdj = document.createElement("img");
    zdj.src = data[0].author.avatar_url;
    if (body != null)
        body.appendChild(zdj);
})
    .catch(err => console.error(err));
//# sourceMappingURL=main.js.map