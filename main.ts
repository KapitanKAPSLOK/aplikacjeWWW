let el = document.querySelector("input[name=imie]") as HTMLInputElement;

let nowyAkapit = document.createElement("p");
nowyAkapit.innerHTML="Nowy akapit.";
nowyAkapit.style.backgroundColor="rgb(100,100,100)"
let body=document.querySelector("body");
body.appendChild(nowyAkapit);

setTimeout(() => {
    console.log("No już wreszcie.");
  }, 2000);