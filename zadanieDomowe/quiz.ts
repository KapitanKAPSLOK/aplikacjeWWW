import { IQuiz, IPytanie} from "./main";

const wybor=sessionStorage.getItem("wybor");
if(wybor !== null){
    const quiz:IQuiz=JSON.parse(wybor);
}else{
    //żaden quiz nie jest wybrany
    window.location.replace("index.html");
}
