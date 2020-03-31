let el = document.querySelector("input[name=imie]") as HTMLInputElement;

let nowyAkapit = document.createElement("p");
nowyAkapit.innerHTML="Nowy akapit.";
nowyAkapit.style.backgroundColor="rgb(100,100,100)"
let body=document.querySelector("body");
if(body!=null)
  body.appendChild(nowyAkapit);

let lista=document.querySelectorAll<HTMLElement>("#contDaneLotu > aside > ol > li");
let najwiekszyPasazer=lista[0];
if(najwiekszyPasazer!=null && lista!=null){
  lista.forEach(element => {
    if(najwiekszyPasazer.getAttribute("data-identyfikator-pasazera")<
    element.getAttribute("data-identyfikator-pasazera")){
      najwiekszyPasazer=element;
    }
  });
  let id=najwiekszyPasazer.getAttribute("data-identyfikator-pasazera");
  console.log(id);
}


setTimeout(() => {
    console.log("No już wreszcie.");
  }, 2000);

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


  //zmienianie koloru tła
  let kolory=["red","orange","yellow","green","blue","indigo","purple"];
  async function teczoweKolory(el: HTMLElement) {
    for(let i=0;i<7;++i){
      await delay(1000);
      el.style.backgroundColor = kolory[i];
    }
  }
  teczoweKolory(body);

  //wyświetlanie zdjęciaautora ostatniego commita w typescripcie
  fetch(' https://api.github.com/repos/Microsoft/TypeScript/commits')
  .then(res => res.json())
  .then(data => {
    const zdj=document.createElement("img");
    zdj.src=data[0].author.avatar_url;
    if(body!=null)
      body.appendChild(zdj);
  })
  .catch(err => console.error(err));



