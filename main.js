var el = document.querySelector("input[name=imie]");
var nowyAkapit = document.createElement("p");
nowyAkapit.innerHTML = "Nowy akapit.";
nowyAkapit.style.backgroundColor = "rgb(100,100,100)";
var body = document.querySelector("body");
body.appendChild(nowyAkapit);
setTimeout(function () {
    console.log("No już wreszcie.");
}, 2000);
