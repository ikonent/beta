const request = require('supertest');
const app = require('./app');

test('Pitäisi kirjautua palveluun nimellä Gösta', async ()=> {
    const body = await request(app).post('/kayttajat/kirjautuminen').send({
        userid:'Gösta',
        passwd:'salasana'})
        .expect('Found. Redirecting to /');
    console.log(body.res.req);
});

test('Löytyykö /kirjautuminen -sivu', async ()=> {
    const req = request(app).get('/kayttajat/kirjautuminen');
    //console.log(req.session);
})