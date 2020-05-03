//interfejs pojedynczego pytania w quizie
export interface IPytanie{
    tresc: string;
    odpowiedz: number;
    kara: number;
}
//interfejs quizu
export interface IQuiz{
    nazwa: string;
    wstep: string;
    pytania: IPytanie[];
}

//funckja delay dla asynchronicznych funkcji
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

//wczytywanie quizu
const wybor=sessionStorage.getItem("wybor");
if(wybor === null){
    //żaden quiz nie został wybrany
    window.location.replace("index.html"); 
}
const quiz:IQuiz=JSON.parse(<string>wybor);

let obszarPytan=document.getElementById("obszarPytan") as HTMLDivElement;
let main=document.querySelector("main") as HTMLDivElement;
let pytania=document.getElementById("pytania") as HTMLFormElement;

let opis=document.createElement('p');

opis.innerHTML=quiz.nazwa+"<br>"+quiz.wstep+"<br>";
if(main!==null){
    main.insertBefore(opis, main.firstChild);
}
//elementy trzymający numer pytania
let pyt=document.createElement('p');
pyt.setAttribute("style","display: inline");
pyt.id="nrPytania";
let nr:number=1;
pyt.innerHTML=String(nr);
//dołączanie informacji o numerze pytania do obszaru pytania
if(pytania!==null){
    pytania.innerHTML="Pytanie ";
    pytania.appendChild(pyt);
    pytania.innerHTML+="/"+String(quiz.pytania.length)+"<br><br>";
    //tworzenie pól formularza z każdym z pytań quizu
    let i=1;
    for(let p of quiz.pytania){
        let tempLabel=document.createElement("label");
        let tempInput=document.createElement("input");
        tempInput.id="pytanie"+i++;
        //zmienna trzymająca sumaryczny czas spędzony na danym pytaniu
        tempInput.dataset.timeSpent="0";
        tempInput.name=tempInput.id;
        tempLabel.setAttribute("for",tempInput.id);
        tempLabel.innerText=p.tresc;
        tempInput.type="number";
        tempLabel.classList.add("hidden");
        tempInput.classList.add("hidden");
        pytania.appendChild(tempLabel);
        pytania.appendChild(tempInput);
    }
}
let nrPytania=document.getElementById("nrPytania") as HTMLParagraphElement;
let odp=document.querySelectorAll<HTMLInputElement>("#pytania > input");
let odpLabels=document.querySelectorAll<HTMLInputElement>("#pytania > label");

odp[nr-1].classList.remove("hidden");
odpLabels[nr-1].classList.remove("hidden");

//klasa obsługująca zegar i mierzenie czasu
class Timer{
    start:number; //data utworzenia timera w milisekundach
    end:number | undefined; //data zatrzymania timera w milisekundach
    zegar:HTMLDivElement | undefined;
    constructor(zegar?:HTMLDivElement){
        this.start=new Date().getTime();
        if(zegar!==undefined){
            zegar.innerText="0:00:00";
            this.zegar=zegar;
            this.update();
        }
    }
    //zwraca liczbę milisekund od rozpoczęcia odliczania
    getTime(){
        if(this.end===undefined){
            let act=new Date();
            return act.getTime()-this.start;
        }else{
            return this.end-this.start;
        }
    }
    //metoda zatrzymująca timer
    stop(){
        this.end=new Date().getTime();
    }
    //metoda resetująca timer
    reset(){
        this.start=new Date().getTime();
        this.end=undefined;
        if(this.zegar!==undefined){
            this.zegar.innerText="0:00:00";
        }
    }
    //parsuje czas w milisekundach do formatu minuty:sekundy:decysekundy
    parseTime(time:number){
        let parsed=String(Math.floor(time/60000))+":";
        let sec=Math.floor(time%60000/1000);
        if(sec<10)
            parsed+="0"+String(sec)+":";
        else
        parsed+=String(sec)+":";
        parsed+=String(Math.floor(time%1000/100));
        return parsed;
    }
    //metoda aktualizująca licznik
    async update(){
        if(this.zegar!==undefined){
            while(this.end===undefined){
                await delay(100);
                let time=this.getTime();
                this.zegar.innerText=this.parseTime(time);
            }
            //zegar został zatrzymany, ustawiamy wartość końcową na zegarze
            let time=this.end-this.start;
            this.zegar.innerText=this.parseTime(time);
        }
    }
}

let zegar=document.getElementById("zegar") as HTMLDivElement;
let timer:Timer;
let timerPytania=new Timer();
if(zegar!==null){
    timer=new Timer(zegar);
}
//zwiększa czas spędzony na aktualnym pytaniu i resetuje licznik
function updateTime(t: Timer){
    odp[nr-1].dataset.timeSpent=String(Number(odp[nr-1].dataset.timeSpent)+t.getTime());
    t.reset();
}

///obsługa przycisków///

const next=document.getElementById("next") as HTMLButtonElement;
const prev=document.getElementById("prev") as HTMLButtonElement;
const end=document.getElementById("end") as HTMLButtonElement;
const save=document.getElementById("save") as HTMLButtonElement;
const saveAll=document.getElementById("saveAll") as HTMLButtonElement;

next.onclick=function(){
    if(nr>=quiz.pytania.length){
        //nie powinno się zdarzyć, ale na wszelki wypadek
        nr=quiz.pytania.length;
        return;
    }
    updateTime(timerPytania);
    odp[nr-1].classList.add("hidden");
    odpLabels[nr-1].classList.add("hidden");
    odp[nr].classList.remove("hidden");
    odpLabels[nr].classList.remove("hidden");
    if(++nr===quiz.pytania.length)
        next.classList.add("hidden");
    if(nr===2){
        prev.classList.remove("hidden");
    }
    nrPytania.innerHTML=String(nr);
}
prev.onclick=function(){
    if(nr<=0){
        //nie powinno się nigdy zdarzyć, ale na wszelki wypadek
        nr=1;
        return;
    }
    updateTime(timerPytania);
    odp[nr-1].classList.add("hidden");
    odpLabels[nr-1].classList.add("hidden");
    odp[nr-2].classList.remove("hidden");
    odpLabels[nr-2].classList.remove("hidden");
    if(--nr===1)
        prev.classList.add("hidden");
    if(nr===quiz.pytania.length-1){
        next.classList.remove("hidden");
    }
    nrPytania.innerHTML=String(nr);
}
//przycisk końca quizu staje się aktywny dopiero po odpowiedzi na wszystkie pytania
if(pytania!==null){
    pytania.oninput=function(){
        for(let p of odp){
            if(p.value===""){
                end.classList.add("hidden");
                return;
            }
        }
        end.classList.remove("hidden");
    }
}
//zakończ powoduje przejście do podsumowania wyników
end.onclick=function(){
    timer.stop();
    updateTime(timerPytania);
    timerPytania.stop();
    let wyniki=document.getElementById("wyniki");
    let gratulacje=document.getElementById("gratulacje");
    opis.classList.add("hidden");
    if(gratulacje!==null){
        gratulacje.innerText+=quiz.nazwa;
        gratulacje.innerHTML+="<br> Twój wynik to ";
        gratulacje.classList.remove("hidden");
    }  
    save.classList.remove("hidden");
    saveAll.classList.remove("hidden");
    obszarPytan.classList.add("hidden");
    if(wyniki!==null){
        wyniki.classList.remove("hidden");
        //tworzenie statystyk quizu
        let i:number=0;
        let kary=0;
        for(let p of odp){
            let tr=document.createElement('tr');
            let th=document.createElement('th');
            th.innerText=String(++i);
            tr.appendChild(th);
            let th2=document.createElement('th');
            th2.innerText=p.value;
            tr.appendChild(th2);
            let th3=document.createElement('th');
            th3.innerText=String(quiz.pytania[i-1].odpowiedz);
            tr.appendChild(th3);
            let th4=document.createElement('th');
            let timeSpent=Number(<string>p.dataset.timeSpent);
            //dodawanie kary za złą odpowiedź
            //if(String(quiz.pytania[i-1].odpowiedz)!==p.value)
               // timeSpent+=1000*quiz.pytania[i-1].kara;    
            th4.innerText=String(timeSpent/1000);
            if(String(quiz.pytania[i-1].odpowiedz)!==p.value){
                th4.innerText+=" (+"+String(quiz.pytania[i-1].kara)+")";
                kary+=quiz.pytania[i-1].kara;
            }          
            tr.appendChild(th4);
            wyniki.appendChild(tr);
        }
        if(gratulacje!==null){
            let time=timer.getTime()+1000*kary;
            gratulacje.innerHTML+=timer.parseTime(time);
        }
    }
}