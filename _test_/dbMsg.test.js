const request = require('supertest');
const app = require('../app');
// Needed for message testing
const db = require("../dbOperations.js");

// Test message functions directly on dbOperations.js

describe("Testing msg functionalities", () => { 
    // Kirjaudutaan palveluun
    const usr = 'brlebbo';
    const pvm = new Date();
    const msgTopic = "Tänään on "+pvm.getDate()+"."+pvm.getMonth()+".";
    
    
    
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
        db.createMessage(viesti,res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        }, 500);
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
            db.editMessage(viesti,res => callback(res));
        // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        }, 500);
    }
    
    // Callback: viestin poistaminen
    function testDelMsg(viestiId, callback) {
        // set time for how long to wait for the command
        setTimeout(() => {
            // this is the actual test
            db.deleteMessage(viestiId,usr,res => callback(res));
            // callback palauttaa tuloksen sinne, mistä funktiota kutsuttiin
        }, 500);
    }
    
    test("Create message", function(done){
        testNewMsg(tulos => {
            expect(tulos).toBe(true);
            return done();
        })
    });    
    
    test("edit message", function(done){
        db.findUserMsgs(usr,false, function(msgs) {
            testEditMsg(msgs[0].id,tulos => {
                expect(tulos).toBe(true);
                return done();
            })
        });
    });
    
    test("delete message", function(done){
        db.findUserMsgs(usr,false, function(msgs) {
            testDelMsg(msgs[0].id, tulos => {
                    expect(tulos).toBe(true);
                    return done();
                });
        });
    });
        
   
   //const muuttuja = request(app).get('/kayttajat/kirjautuminen');
});
