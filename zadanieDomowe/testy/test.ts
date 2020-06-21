/*
Testy powinny być odpalane na świeżo założonej bazie 
lub przy niezmodyfikowanym koncie user1.
*/
import { expect } from 'chai';
import { driver, IWebDriverCookie } from 'mocha-webdriver';
const { Builder, By, Key, until, Cookie } = require('selenium-webdriver');

 describe('testy',  function () {
    it('zmiana hasła powinna wylogować wszystkie sesje użytkownika', async function() {
        this.timeout(30000);
        await driver.get('http://localhost:3000/');
        //logowanie na pierwszej sesji
        await driver.findElement(By.name('login')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('user1');
        await (await driver.find('input[type=submit]')).click();
        //zapisywanie ciasteczka sesyjnego
        let cookie =await driver.manage().getCookie('connect.sid');
        //zmiana sesji
        await driver.manage().deleteAllCookies();
        await driver.get('http://localhost:3000/');
        //ponowne logowanie
        await driver.findElement(By.name('login')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('user1');
        await (await driver.find('input[type=submit]')).click();
        //zmiana hasła
        await driver.findElement(By.name('haslo')).sendKeys('user1');
        await (await driver.findElement(By.id('zmien'))).click();
        //wylogowywanie równoległych sesji jest asynchroniczne, dlatego dla pewności trzeba zaczekać
        await driver.sleep(1000);
        //powrót do poprzedniej sesji
        await driver.manage().deleteAllCookies();
        await driver.manage().addCookie({
            "name": cookie.name, 
            "value": cookie.value
        });
        await driver.get('http://localhost:3000/');
        //sprawdzanie czy jesteśmy na stronie do logowania
        let title=await driver.getTitle();
        expect(title).to.equal('logowanie');
    })

    it('quiz powinno się dać rozwiązać tylko raz', async function() {
        this.timeout(30000);
        await driver.get('http://localhost:3000/');
        //logowanie
        await driver.findElement(By.name('login')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('user1');
        await driver.find('input[type=submit]').click();
        await driver.find('input[type=submit]').click();
        //czekanie na załadowanie się pytań
        await driver.sleep(5000);
        //rozwiązywanie quizu
        await driver.switchTo().activeElement().sendKeys('123');
        await (await driver.findElement(By.id('next'))).click();
        await driver.switchTo().activeElement().sendKeys('123');
        await (await driver.findElement(By.id('next'))).click();
        await driver.switchTo().activeElement().sendKeys('123');
        //wysyłanie wyników
        await driver.findElement(By.id('end')).click();
        //powrót do strony głównej
        await driver.get('http://localhost:3000/');
        await driver.find('input[type=submit]').click();
        //ponowna próba rozpoczęcia quizu powinna wczytać ponownie stronę główną z błędem
        let title=await driver.getTitle();
        //await driver.quit();
        expect(title).to.equal('Quizy');   
    });

})