var express = require('express');
var router = express.Router();
//klasa przechowująca informację o pojedynczym memie w raz z jego historią cen
class Meme {
    constructor(name, url, price = 0) {
        this.id = Meme.ileMemow++;
        this.name = name;
        this.url = url;
        this.prices = new Array();
        this.prices.push(price);
    }
    getPrice() {
        return this.prices[this.prices.length - 1];
    }
    changePrice(price) {
        this.prices.push(price);
    }
}
Meme.ileMemow = 0;
let memeList = new Array();
//dodawanie memów do listy
memeList.push(new Meme('Gold', new URL("https://i.redd.it/h7rplf9jt8y21.png"), 1000));
memeList.push(new Meme('Platinum', new URL('http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'), 1100));
memeList.push(new Meme('Elite', new URL('https://i.imgflip.com/30zz5g.jpg'), 1200));
//wyszukiwanie w tablicy memów [ile] najdroższych
function najdrozsze(ile) {
    let most_expensive = new Array(ile);
    memeList.sort((a, b) => { return b.getPrice() - a.getPrice(); });
    for (let i = 0; i < ile; ++i) {
        if (i < memeList.length) {
            most_expensive[i] = memeList[i];
        }
    }
    return most_expensive;
}
//wyszukiwanie mema w tablicy o podanym id
function get_meme(id) {
    for (let mem of memeList) {
        if (mem.id == id)
            return mem;
    }
    //nie znaleziono mema o podanym id
    return null;
}
//renderowanie strony głównej
router.get('/', function (req, res) {
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: najdrozsze(3) });
});
//strony poszczególnych memów z historią ich cen
router.get('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    meme.prices.reverse();
    res.render('meme', { meme: meme });
    meme.prices.reverse();
});
router.post('/meme/:memeId', function (req, res) {
    let meme = get_meme(req.params.memeId);
    let price = req.body.price;
    meme.changePrice(price);
    console.log(req.body.price);
    meme.prices.reverse();
    res.render('meme', { meme: meme });
    meme.prices.reverse();
});
module.exports = router;
