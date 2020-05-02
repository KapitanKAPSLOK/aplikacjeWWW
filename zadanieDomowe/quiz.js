const wybor = sessionStorage.getItem("wybor");
if (wybor !== null) {
    const quiz = JSON.parse(wybor);
}
else {
    //żaden quiz nie jest wybrany
    window.location.replace("index.html");
}
