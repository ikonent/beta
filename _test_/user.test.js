const request = require('supertest');
const app = require('../app');

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
                
                }, 500)
            }
        
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
    
    it('Pitäisi kirjautua palveluun nimellä brlebbo', done => {
        try {
            testLogIn(tulos =>{expect(tulos.status).toBe(302)}); //'Found. Redirecting to /')} )
            /*const p = request(app)
                .post('/kayttajat/kirjautuminen')
                .send({
                    userid:'brlebbo',
                    passwd:'bebbo'})
                .then(tulos => { 
                    expect(tulos).toBe('Found. Redirecting to /')
                });
            // Kun on saatu tulos, voidaan päättää testi
            */
            done();
        } catch (error) {
            done(error);
        }
        
    });
    
    
    
    // Kirjaudutaan ulos
    it('Pitäisi kirjautua ulos (fake)', done => {
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