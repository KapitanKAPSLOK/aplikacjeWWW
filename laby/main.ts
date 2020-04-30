import { Fibonacci } from "./fib";
const nowyAkapit = document.createElement("p");
nowyAkapit.innerHTML="Nowy akapit.";
nowyAkapit.style.backgroundColor="rgb(100,100,100)"
const body=document.querySelector("body");
if(body!=null)
  body.appendChild(nowyAkapit);

const lista=document.querySelectorAll<HTMLElement>("#contDaneLotu > aside > ol > li");
let najwiekszyPasazer=lista[0];
if(najwiekszyPasazer!=null && lista!=null){
  lista.forEach(element => {
    if(najwiekszyPasazer.getAttribute("data-identyfikator-pasazera")<
    element.getAttribute("data-identyfikator-pasazera")){
      najwiekszyPasazer=element;
    }
  });
  const id=najwiekszyPasazer.getAttribute("data-identyfikator-pasazera");
  console.log(id);
}


setTimeout(() => {
    console.log("No już wreszcie.");
  }, 2000);

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


  // zmienianie koloru tła
  const kolory=["red","orange","yellow","green","blue","indigo","purple"];
  async function teczoweKolory(el: HTMLElement) {
    for(let i=0;i<7;++i){
      await delay(1000);
      el.style.backgroundColor = kolory[i];
    }
  }
  teczoweKolory(body);

  // wyświetlanie zdjęcia autora ostatniego commita w typescripcie
  fetch(' https://api.github.com/repos/Microsoft/TypeScript/commits')
  .then(res => res.json())
  .then(dataRes => {
    const zdj=document.createElement("img");
    zdj.src=dataRes[0].author.avatar_url;
    if(body!=null)
      body.appendChild(zdj);
  })
  .catch(err => console.error(err));

const aside=document.querySelector("#contListaLotow > aside") as HTMLDivElement;
const grid=document.querySelector("#contListaLotow") as HTMLDivElement;
if(grid!=null)
  grid.onclick=(event)=>{
    if(aside.contains(event.target as Node))
      changeColor(aside)
  };

// tworzenie ciągu liczb fibbonacciego
const fib =new Fibonacci();

function changeColor(el: HTMLElement){
  if(el===null) return;
  if(el.style.backgroundColor==='green')
    el.style.backgroundColor='blue';
  else if(el.style.backgroundColor==='blue')
    el.style.backgroundColor='green';
  else
    el.style.backgroundColor='green';
  for(let i=0;i<9;++i){
    fib.nextFib();
  }
  console.log(fib.nextFib());
}

const formularz=document.getElementById("rezerwacjaForm") as HTMLFormElement;

// kliknięcie w obszar formularza nie powinno zmieniać koloru
if(formularz!=null)
  formularz.onclick=(event)=>{
      event.stopPropagation();
  };

const imie = document.querySelector("input[name=imie]") as HTMLInputElement;
const nazwisko = document.querySelector("input[name=nazwisko]") as HTMLInputElement;
const data = document.querySelector("input[name=data]") as HTMLInputElement;
const submit=document.querySelector("input[type=submit]") as HTMLInputElement;
const skad = document.getElementById("skad") as HTMLSelectElement;
const dokad = document.getElementById("dokad") as HTMLSelectElement;

if(submit!=null && (imie.value==="" || nazwisko.value==="" ||
data.valueAsDate < new Date())){
  submit.classList.add('hidden');
 }

formularz.oninput=()=>{
  if(imie.value!=="" && nazwisko.value!=="" && data.valueAsDate >= new Date())
   submit.classList.remove("hidden");
   else
    submit.classList.add('hidden');
}

const potwierdzenie=document.getElementById("okienko") as HTMLDivElement;

potwierdzenie.style.display="none";

// pokazywanie okienka o udanej rezerwacji
formularz.onsubmit=(event)=> {
  potwierdzenie.style.display=null;
  const tekst=document.createElement("h1");
  tekst.innerText="Zarezerwowano lot z "+skad.value+" do " +
  dokad.value+" dla pasażera: "+ imie.value+" "+nazwisko.value+".";
  potwierdzenie.innerText=null;
  potwierdzenie.appendChild(tekst);
  event.preventDefault();
}

body.onclick=()=>potwierdzenie.style.display="none";

