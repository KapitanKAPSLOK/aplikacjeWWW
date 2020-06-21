//interfejs pojedynczego pytania w quizie
interface IPytanie{
    tresc: string;
    //odpowiedz: number;
    kara: number;
}
//interfejs quizu
interface IQuiz{
    nazwa: string;
    wstep: string;
    pytania: IPytanie[];
}
//interfejs odpowiedzi do quizu
interface IOdpowiedzi{
    nazwa: string; //nazwa quizu
    czasCalkowity: Number; //czas rozwiązania quizu wraz z karami
    czas: Number[] | null; //czasy odpowiedzi na kolejne pytania bez kar
}

//funckja delay dla asynchronicznych funkcji
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

//wczytywanie quizu
fetch('/quizData').then((j)=>{
    j.json().then((quiz:IQuiz)=>{
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

        //pokazanie pierwszego pytania i umieszczenie kursora w jego polu odpowiedzi
        odp[nr-1].classList.remove("hidden");
        odpLabels[nr-1].classList.remove("hidden");
        odp[nr-1].focus();
        odp[nr-1].select();

        //informacja o przyznawanej karze czasowej za błędną odpowiedź
        let ileKary=document.createElement('p');
        ileKary.innerHTML="(kara za błędną odpowiedź: "+String(quiz.pytania[0].kara)+" sekund)<br>";
        ileKary.style.display="inline";
        ileKary.style.fontSize="14px";
        pytania.insertBefore(ileKary,pytania.children[2]);

        //obsługa naciśnięć klawiszy na stronie
        function logKey(e:KeyboardEvent){
            if(e.keyCode===13){
                next.click();
            }
        }
        document.addEventListener("keydown",logKey);

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
                    this.zegar.style.color="#ca0000";
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

        next.onclick=function(){
            if(nr>=quiz.pytania.length){
                nr=quiz.pytania.length;
                return;
            }
            updateTime(timerPytania);
            odp[nr-1].classList.add("hidden");
            odpLabels[nr-1].classList.add("hidden");
            odp[nr].classList.remove("hidden");
            odpLabels[nr].classList.remove("hidden");
            odp[nr].focus();
            odp[nr].select();
            if(++nr===quiz.pytania.length)
                next.classList.add("hidden");
            if(nr===2){
                prev.classList.remove("hidden");
            }
            nrPytania.innerHTML=String(nr);
            ileKary.innerHTML=ileKary.innerHTML="(kara za błędną odpowiedź: "+String(quiz.pytania[nr-1].kara)+" sekund)<br>";
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
            odp[nr-2].focus();
            odp[nr-2].select();
            if(--nr===1)
                prev.classList.add("hidden");
            if(nr===quiz.pytania.length-1){
                next.classList.remove("hidden");
            }
            nrPytania.innerHTML=String(nr);
            ileKary.innerHTML=ileKary.innerHTML="(kara za błędną odpowiedź: "+String(quiz.pytania[nr-1].kara)+" sekund)<br>";
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
        let wynik:number; //zmienna trzymająca wynik quizu

        //zakończ powoduje przejście do podsumowania wyników
        end.onclick=function(){
            timer.stop();
            updateTime(timerPytania);
            timerPytania.stop();

            //obliczanie i dodawanie do formularza informacji o procentowym czasie spędzonym nad każdym pytaniem
            for(let p of odp){
                let time=document.createElement("input");
                time.type='hidden';
                time.name=p.name+'czas';
                time.value=String(Number(p.dataset.timeSpent)*100/timer.getTime());
                pytania.appendChild(time);
            }
            pytania.submit();
        }

        //tworzenie id wyniku na podstawie ilości zapisanych dotąd wyników w localstorage
        function getAnswerIdNumber(){
            let storage=window.localStorage;
            let ilosc=storage.getItem(quiz.nazwa+"iloscWynikow");
            let ile:number;
            if(ilosc===null){
                //nie zapisano dotąd żadnego wyniku, tworzenie nowej zmiennej
                storage.setItem(quiz.nazwa+"iloscWynikow","1");
                ile=1;
            }else{
                ile=Number(ilosc);
                storage.setItem(quiz.nazwa+"iloscWynikow",String(++ile));
            }
            return quiz.nazwa+"wynikNr"+String(ile);
        }
    }) 
})


