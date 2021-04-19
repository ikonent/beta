const request = require('supertest');
var session = require('supertest-session');
const app = require('../app');
// Needed for message testing
const db = require("../dbOperations.js");

describe("Testing msg functionalities", () => { 
    // Kirjaudutaan palveluun
    const usr = 'brlebbo';
    const pvm = new Date();
    const msgTopic = "Tänään on "+pvm.getDate()+"."+pvm.getMonth()+".";
    
     var authenticatedSession;
    
    // Ennen viestien muokkaamista on kirjauduttava sisälle, jotta viestejä voi lähetellä ym.
    beforeEach(function (done) {
        var testSession = null;
        testSession = session(app);
        testSession.post('/kayttajat/kirjautuminen')
            .send({ userid: usr, passwd: 'bebbo' })
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });
    // Yritetään nollata muuttujia, jotta muistinhallinta voi siivota
    afterEach(function(done){
        authenticatedSession = null;
        testSession = null;
        return done();
    })
    
    // Callback: Uuden viestin lähettäminen    
    function testNewMsg(callback) {
        // set time for how long to wait for the command
        setTimeout(() => {
        // this is the actual test
        const viesti = {
            message: "Kello on nyt "+pvm.getHours()+":"+pvm.getMinutes(),
            sender:usr,
            topic:msgTopic            
        };
        const tulos = authenticatedSession.post('./uusi_viesti').send(viesti).then(res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        }, 5000);
    }
    
    
     // Callback: viestin muokkaaminen
    function testEditMsg(viestiId, callback) {
        // set time for how long to wait for the command
        setTimeout(() => {
        // this is the actual test
        const viesti = {
            sender:usr,
            topic:msgTopic,
            message: "Kello onkin jo muuta: "+pvm.getHours()+":"+pvm.getMinutes(),
            muokkaa:viestiId
        };
        const tulos = authenticatedSession.post('./uusi_viesti/?muokkaa='+viestiId).send(viesti).then(res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        }, 5000);
    }
    
    // Callback: viestin muokkaaminen
    function testDelMsg(viestiId, callback) {
        // set time for how long to wait for the command
        setTimeout(() => {
        // this is the actual test
        const tulos = authenticatedSession.get('./keskustelu_aiheesta/?delid='+viestiId)
        .then(res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        }, 5000);
    }
    
   it('Pitäisi lähettää uusi viesti', done => {
        //try {
            
            testNewMsg(tulos => {expect(tulos.status).toBe(302)});
            done();
            
        //} catch(error) {
        //    done(error);
        //}
	});
    // Muuttuja viimeisimmän viestin id:lle (olevinaan)
    
       

        it('Pitäisi muokata viestiä', done => {
            //try {
                // Etsitään käyttäjän uusin viesti, jotta sitä on mahdollista muokata
                db.findUserMsgs(usr,false, function(msgs) {
                    testEditMsg(msgs[0].id, tulos => {expect(tulos.status).toBe(302)});
                    done();
                });
                
                
            //} catch(error) {
            //    done(error);
            //}
        });

        it('Pitäisi poistaa viesti', done => {
            //try {
                // Poistetaan uusin viesti
                db.findUserMsgs(usr,false, function(msgs) {
                    testDelMsg(msgs[0].id, tulos => {expect(tulos.status).toBe(302)});
                    done();
                });
            //} catch(error) {
            //    done(error);
            //}
        });
    
   const muuttuja = request(app).get('/kayttajat/kirjautuminen');
});
