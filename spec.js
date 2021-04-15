const request = require('supertest');
const app = require('./app');
/*
// Luodaan käyttäjätunnus
test('Luoda uusi käyttäjä', async ()=> {
    await request(app).post('/kayttajat/rekisteroityminen').send({
        userid:'brlebbo',
        passwd:'bebbo',
        passwd:'bebbo'})
        .expect('Found. Redirecting to /');
    
});
*/
// Kirjaudutaan palveluun
test('Pitäisi kirjautua palveluun nimellä brlebbo', done => {
    addAsync(10,5, result =>{
        const body = request(app).post('/kayttajat/kirjautuminen').send({
            userid:'brlebbo',
            passwd:'bebbo'})
        .expect(result).toBe('Found. Redirecting to /');
    //console.log(body.res.req);
        done();
     })
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
test('Pitäisi kirjautua ulos (fake)', done => {
    addAsync(10,5, result => {
        // tämä testaa oikeasti, ohjautuuko käyttäjä kirjautumissivun sijaan ulos, kuten tapahtuu, kun kirjautunut käyttäjä yrittää mennä kirjautumissivulle. 
        const req = request(app).get('/kayttajat/kirjautuminen').expect(result).toBe(451);
        //console.log(req.session);
        done();    
    })
    
})