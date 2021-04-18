const request = require('supertest');
const app = require('../app');

jest.setTimeout(10000); 

/*
// Sign in test
// Not working until a fake response function is created for registerUser:
// 
describe("Testing new user sign in", ()=>{
   // Callback, joka odottaa logIn-testin toteutumista.
    function testSignIn(callback) {
        // set time for how long to wait for the command
        setTimeout(() => {
        // this is the actual test
        const tulos = request(app).post('/kayttajat/rekisteroityminen').send({
                userid:'Gupka',
                passwd:'serge1'}).then(res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin

        }, 500)
    };
    
    // Callback, joka odottaa register-testin toteutumista.
    function testLogOut(callback) {
        // set time for how long to wait for the command
      setTimeout(() => {
          // this is the actual test
        const tulos = request(app).get('/kayttajat/kirjautuminen').then(res=> callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        //callback(tulos);
      }, 500);
    };
    
    it('Pitäisi luoda tili palveluun nimellä Gupka', done => {
        try {
            testSignIn(tulos =>{expect(tulos.status).toBe(302)});
            
            // Kun on saatu tulos, voidaan päättää testi
            
            done();
        } catch (error) {
            done(error);
        } 
    });
     // Kirjaudutaan ulos
    it('Pitäisi kirjauta uusi käyttäjä ulos (fake)', done => {
        try {
        testLogOut(tulos => {
            expect(tulos.status).toBe(200);// Vastaus on kyllä nyt 'OK'. Hiukan epäilyttää mutta ei-kirjautuneelle vastaus näytti olevan 304= 'Not modified' Entä sivustolle tulevalle?
            done();
        });
        } catch (error) {
            done(error);
        }
    });
});
*/
describe("Testing log i/o", () => { 
    // Kirjaudutaan palveluun
    const usr = 'brlebbo';
          
    // Callback, joka odottaa logIn-testin toteutumista.
    function testLogIn(callback) {
        // set time for how long to wait for the command
        setTimeout(() => {
        // this is the actual test
        const tulos = request(app).post('/kayttajat/kirjautuminen').send({
                userid:usr,
                passwd:'bebbo'}).then(res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin

        }, 4000);
    };
    
    it('Pitäisi kirjautua palveluun nimellä brlebbo', done => {
        try {
            testLogIn(tulos =>{expect(tulos.status).toBe(302)}); //'Found. Redirecting to /')} )
            // Kun on saatu tulos, voidaan päättää testi
            done();
        } catch (error) {
            done(error);
        }
        
    });
    
    // Kirjaudutaan ulos
    // Remember to uncomment also function testLogOut
    // This doesn't work currently, because I don't know how to fake a user that has signed in
    
      
    // Callback, joka odottaa register-testin toteutumista.
    function testLogOut(callback) {
        // set time for how long to wait for the command
      setTimeout(() => {
          // this is the actual test
        const tulos = request(app).get('/kayttajat/kirjautuminen').then(res=> {
            console.log(res);
            callback(res)
        });
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        //callback(tulos);
      }, 4000);
    };    
    
    it('Pitäisi kirjautua ulos (fake)', done => {
        try {
        testLogOut(tulos => {
            expect(tulos.status).toBe(302); // get(/kayttajat/kirjautuminen) => 302: redirect on log out; 200: OK on log in
            done();
        });
        } catch (error) {
            done(error);
        }
    });
    
    
});