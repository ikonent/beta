const request = require('supertest');
const app = require('./app');

// Luodaan käyttäjätunnus
test('Luoda uusi käyttäjä', async ()=> {
    await request(app).post('/kayttajat/rekisteroityminen').send({
        userid:'brlebbo',
        passwd:'bebbo',
        passwd:'bebbo'})
        .expect('Found. Redirecting to /');
    
});

// Kirjaudutaan palveluun
test('Pitäisi kirjautua palveluun nimellä Gösta', async ()=> {
    const body = await request(app).post('/kayttajat/kirjautuminen').send({
        userid:'Gösta',
        passwd:'salasana'})
        .expect('Found. Redirecting to /');
    //console.log(body.res.req);
});

// Aloitetaan uusi keskustelu

// Kirjoitetaan keskusteluun toinen viesti

// Muokataan viestiä

// Poistetaan viesti

// Kirjaudutaan ulos
test('Pitäisi kirjautua ulos (fake)', async ()=> {
    // tämä testaa oikeasti, ohjautuuko käyttäjä kirjautumissivun sijaan ulos, kuten tapahtuu, kun kirjautunut käyttäjä yrittää mennä kirjautumissivulle. 
    const req = request(app).get('/kayttajat/kirjautuminen').expect(451);
    //console.log(req.session);
})