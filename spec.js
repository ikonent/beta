const request = require('supertest');
const app = require('./app');

/*
// Callback, joka odottaa register-testin toteutumista.
function testRegister(callback) {
    // set time for how long to wait for the command
  setTimeout(() => {
      // this is the actual test
    const tulos = request(app).post('/kayttajat/rekisteroityminen').send({
        userid:'brlebbo',
        passwd:'bebbo',
        passwd:'bebbo'});
    // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
    callback(tulos);
  }, 500);
}


// Luodaan käyttäjätunnus
test('Pitäisi luoda uusi käyttäjä', done => {
    testRegister(tulos =>{ 
        expect(tulos).toBe('Found. Redirecting to /');
    });
    done();            
});
*/
/*
// Callback, joka odottaa logIn-testin toteutumista.
function testLogIn(callback) {
    // set time for how long to wait for the command
  setTimeout(() => {
      // this is the actual test
    const tulos = request(app).post('/kayttajat/kirjautuminen').send({
            userid:'brlebbo',
            passwd:'bebbo'});
    // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
    callback(tulos);
  }, 500)
}

// Kirjaudutaan palveluun
test('Pitäisi kirjautua palveluun nimellä brlebbo', done => {
    // Kutsutaan ajallisesti rajattua funktiota, joka testaa.
    // Lähetetään funktioon asynkroninen sisältö, 
    // joka odottaa vastasta testiin muuttujaan 'tulos'.
    // tämän 'tuloksen' odotetaan olevan: "Found. Redirecting to /"
    testLogIn(tulos => {
        expect(tulos).toBe('Found. Redirecting to /');
        // Kun on saatu tulos, voidaan päättää testi
        done();
    });
});
*/

// Kirjaudutaan palveluun
test('Pitäisi kirjautua palveluun nimellä brlebbo', done => {
    const tulos = request(app).post('/kayttajat/kirjautuminen').send({
            userid:'brlebbo',
            passwd:'bebbo'}).expect('Found. Redirecting to /');
        // Kun on saatu tulos, voidaan päättää testi
        done();
    });


/*
// Aloitetaan uusi keskustelu
test('Pitäisi luoda uusi viesti', done => {
    addAsync(10,5, result =>{
        const lomakeTesti = wrapper.find("form");
        var pvm = new Date()
        lomakeTesti.simulate("change", {topic: "Tänään on "+pvm.getDate,
                                        message: "Kello on nyt"+pvm.getHours()+":"+pvm.getMinutes()},
                                        true);
        lomakeTesti.find("#submit").simulate("click");
        expect(result).toBe("");
        );
        done();
    })
});
*/

// Kirjoitetaan keskusteluun toinen viesti

// Muokataan viestiä

// Poistetaan viesti

// Kirjaudutaan ulos


/*
// Callback, joka odottaa register-testin toteutumista.
function testLogOut(callback) {
    // set time for how long to wait for the command
  setTimeout(() => {
      // this is the actual test
    const tulos = request(app).get('/kayttajat/kirjautuminen')
    // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
    callback(tulos);
  }, 500);
}

test('Pitäisi kirjautua ulos (fake)', done => {
    testLogOut(tulos => {
        expect(tulos).toBe(451);
        done();
    });
});
*/


test('Pitäisi kirjautua ulos (fake)', done => {
    const tulos = request(app).get('/kayttajat/kirjautuminen').expect(451);
        done();
});

