"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Testy powinny być odpalane na świeżo założonej bazie
lub przy niezmodyfikowanym koncie user1.
*/
const chai_1 = require("chai");
const mocha_webdriver_1 = require("mocha-webdriver");
const { Builder, By, Key, until, Cookie } = require('selenium-webdriver');
describe('testy', function () {
    it('zmiana hasła powinna wylogować wszystkie sesje użytkownika', async function () {
        this.timeout(30000);
        await mocha_webdriver_1.driver.get('http://localhost:3000/');
        //logowanie na pierwszej sesji
        await mocha_webdriver_1.driver.findElement(By.name('login')).sendKeys('user2');
        await mocha_webdriver_1.driver.findElement(By.name('password')).sendKeys('user2');
        await (await mocha_webdriver_1.driver.find('input[type=submit]')).click();
        //zapisywanie ciasteczka sesyjnego
        let cookie = await mocha_webdriver_1.driver.manage().getCookie('connect.sid');
        //zmiana sesji
        await mocha_webdriver_1.driver.manage().deleteAllCookies();
        await mocha_webdriver_1.driver.get('http://localhost:3000/');
        //ponowne logowanie
        await mocha_webdriver_1.driver.findElement(By.name('login')).sendKeys('user2');
        await mocha_webdriver_1.driver.findElement(By.name('password')).sendKeys('user2');
        await (await mocha_webdriver_1.driver.find('input[type=submit]')).click();
        //zmiana hasła
        await mocha_webdriver_1.driver.findElement(By.name('haslo')).sendKeys('user2');
        await (await mocha_webdriver_1.driver.findElement(By.id('zmien'))).click();
        //wylogowywanie równoległych sesji jest asynchroniczne, dlatego dla pewności trzeba zaczekać
        await mocha_webdriver_1.driver.sleep(1000);
        //powrót do poprzedniej sesji
        await mocha_webdriver_1.driver.manage().deleteAllCookies();
        await mocha_webdriver_1.driver.manage().addCookie({
            "name": cookie.name,
            "value": cookie.value
        });
        await mocha_webdriver_1.driver.get('http://localhost:3000/');
        //sprawdzanie czy jesteśmy na stronie do logowania
        let title = await mocha_webdriver_1.driver.getTitle();
        chai_1.expect(title).to.equal('logowanie');
    });
    it('quiz powinno się dać rozwiązać tylko raz', async function () {
        this.timeout(30000);
        await mocha_webdriver_1.driver.get('http://localhost:3000/');
        //logowanie
        await mocha_webdriver_1.driver.findElement(By.name('login')).sendKeys('user2');
        await mocha_webdriver_1.driver.findElement(By.name('password')).sendKeys('user2');
        await mocha_webdriver_1.driver.find('input[type=submit]').click();
        await mocha_webdriver_1.driver.find('input[type=submit]').click();
        //czekanie na załadowanie się pytań
        await mocha_webdriver_1.driver.sleep(5000);
        //rozwiązywanie quizu
        await mocha_webdriver_1.driver.switchTo().activeElement().sendKeys('123');
        await (await mocha_webdriver_1.driver.findElement(By.id('next'))).click();
        await mocha_webdriver_1.driver.switchTo().activeElement().sendKeys('123');
        await (await mocha_webdriver_1.driver.findElement(By.id('next'))).click();
        await mocha_webdriver_1.driver.switchTo().activeElement().sendKeys('123');
        //wysyłanie wyników
        await mocha_webdriver_1.driver.findElement(By.id('end')).click();
        //powrót do strony głównej
        await mocha_webdriver_1.driver.get('http://localhost:3000/');
        await mocha_webdriver_1.driver.find('input[type=submit]').click();
        //ponowna próba rozpoczęcia quizu powinna wczytać ponownie stronę główną z błędem
        let title = await mocha_webdriver_1.driver.getTitle();
        //await driver.quit();
        chai_1.expect(title).to.equal('Quizy');
    });
});
