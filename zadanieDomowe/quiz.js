//wczytywanie quizu
const wybor = sessionStorage.getItem("wybor");
if (wybor === null) {
    //żaden quiz nie został wybrany
    window.location.replace("index.html");
}
const quiz = JSON.parse(wybor);
let obszarPytan = document.getElementById("obszarPytan");
let main = document.querySelector("main");
let pytania = document.getElementById("pytania");
const opis = document.createElement('p');
opis.innerHTML = quiz.nazwa + "<br>" + quiz.wstep + "<br>";
if (main !== null) {
    main.insertBefore(opis, main.firstChild);
}
//elementy trzymający numer pytania
let pyt = document.createElement('p');
pyt.setAttribute("style", "display: inline");
pyt.id = "nrPytania";
let nr = 1;
pyt.innerHTML = String(nr);
//dołączanie informacji o numerze pytania do obszaru pytania
if (pytania !== null) {
    pytania.innerHTML = "Pytanie ";
    pytania.appendChild(pyt);
    pytania.innerHTML += "/" + String(quiz.pytania.length) + "<br><br>";
    //tworzenie pól formularza z każdym z pytań quizu
    let i = 1;
    for (let p of quiz.pytania) {
        let tempLabel = document.createElement("label");
        let tempInput = document.createElement("input");
        tempInput.id = "pytanie" + i++;
        tempInput.name = tempInput.id;
        tempLabel.setAttribute("for", tempInput.id);
        tempLabel.innerText = p.tresc;
        tempInput.type = "number";
        tempLabel.classList.add("hidden");
        tempInput.classList.add("hidden");
        pytania.appendChild(tempLabel);
        pytania.appendChild(tempInput);
    }
}
let nrPytania = document.getElementById("nrPytania");
let odp = document.querySelectorAll("#pytania > input");
let odpLabels = document.querySelectorAll("#pytania > label");
odp[nr - 1].classList.remove("hidden");
odpLabels[nr - 1].classList.remove("hidden");
//obsługa przycisków
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const end = document.getElementById("end");
next.onclick = function () {
    if (nr >= quiz.pytania.length) {
        //nie powinno się zdarzyć, ale na wszelki wypadek
        nr = quiz.pytania.length;
        return;
    }
    odp[nr - 1].classList.add("hidden");
    odpLabels[nr - 1].classList.add("hidden");
    odp[nr].classList.remove("hidden");
    odpLabels[nr].classList.remove("hidden");
    if (++nr === quiz.pytania.length)
        next.classList.add("hidden");
    if (nr === 2) {
        prev.classList.remove("hidden");
    }
    nrPytania.innerHTML = String(nr);
};
prev.onclick = function () {
    if (nr <= 0) {
        //nie powinno się nigdy zdarzyć, ale na wszelki wypadek
        nr = 1;
        return;
    }
    odp[nr - 1].classList.add("hidden");
    odpLabels[nr - 1].classList.add("hidden");
    odp[nr - 2].classList.remove("hidden");
    odpLabels[nr - 2].classList.remove("hidden");
    if (--nr === 1)
        prev.classList.add("hidden");
    if (nr === quiz.pytania.length - 1) {
        next.classList.remove("hidden");
    }
    nrPytania.innerHTML = String(nr);
};
