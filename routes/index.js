var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../dbOperations');
const Localization = require("localizationjs");
const locale = new Localization({ defaultLocale: "fi" });

//Dictionaries
const dictionaryFI = require('../languages/fi');
const dictionaryEN = require('../languages/en');
// create a locale manager

// Globaalit muuttujat

// add the dictionaries
locale.addDict("fi", dictionaryFI);
locale.addDict("en", dictionaryEN);


function checkLang(langParam){
    if (langParam !=undefined) {
        // This is to show language on URL
        var addToUrl ='';
        if (langParam != locale.getDefaultLocale()){
            addToUrl = langParam+'/';
        }
        locale.setCurrentLocale(langParam);
        return addToUrl;
    }
}

/* GET home page. */
router.get('(/:lang(en|fi))?/', function(req, res, next) {
    //console.log(req);
    //console.log(res);
    //console.log(req.query);
    //console.log(req.session);
    
    // Check if there is an effort to change lang
    var addToUrl = checkLang(req.params.lang);
    
    
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }

    if(req.query.h_uusin!= undefined){
        //console.log(req.query.h_uusin);
        req.session.h_uusin = (req.query.h_uusin=='true');

    } else if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }

    if(req.query.h_tiivis != undefined){
        req.session.h_tiivis = (req.query.h_tiivis == 'true');

    } else if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }
    //console.log("jotain tapahtu "+req.session.h_uusin);
    db.findTitles(req.session.h_uusin,function(msg) {
        return res.status(200).render('index', {
            dict:locale,
            title: 'Kaikki viestit',
            login: req.session.userid,
            messages: msg,
            topikki:'',
            url:addToUrl+'?',
            onLogPage:false,
            onSignPage:false,
            p_uusin:true,                       // Is newest message on top button visible
            p_tiivis:false,                     // Is condense messages button visible
            h_uusin:req.session.h_uusin,        // value of newest on top button
            h_tiivis:req.session.h_tiivis,      // value of condense messages button
            p_tietoa:true   
        }); 
    });
});

const tietoa_urls = [
    'tietoa',
    'about'
];
// '(/:lang(en|fi))?/'+locale.translate("urls.tietoa")
/* GET about page. */
router.get('/'+tietoa_urls.join('|')+'/:lang?', function(req, res) {
    // Check if there is an effort to change lang
    console.log("lang "+req.params.lang);
    var addToUrl = checkLang(req.params.lang);
    
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }
    return res.status(200).render('tietoa', { title: 'Ruotijat - '+locale.translate("tietoa.title"),
                                 login: req.session.userid,
                                 dict:locale,                          
                                 onLogPage:false,
                                 onSignPage:false,
                                 url:addToUrl+'/'+locale.translate("urls.tietoa")+'/?',
                                 topikki:'',
                                 p_uusin:false,
                                 p_tiivis:false,
                                 h_uusin:req.session.h_uusin,
                                 h_tiivis:req.session.h_tiivis,
                                 p_tietoa:true
                                });
});

const aiheesta_urls = [
    'keskustelu_aiheesta',
    'on_topic'
];
// jemmaan tämä reg exp: (/:lang(fi))?

/* GET about page. */
router.get('/'+aiheesta_urls.join('|')+'/:lang?', function(req, res) {
    // Check if user tries to control language
    var addToUrl = checkLang(req.params.lang);
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }

    if(req.query.h_uusin!= undefined){
        //console.log(req.query.h_uusin);
        req.session.h_uusin = (req.query.h_uusin=='true');

    } else if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }

    if(req.query.h_tiivis != undefined){
        req.session.h_tiivis = (req.query.h_tiivis == 'true');

    } else if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }

    if(req.query.delid != undefined){
        //console.log("poistetaan id: "+req.query.delid);
        db.deleteMessage(req.query.delid,req.session.userid,function(rvalue) {
            if(rvalue && req.query.id != undefined){
                //console.log("Onnistui?! paluu keskusteluun.");
                return res.status(302).redirect('./?id='+req.query.id);

            } else if (req.query.id === undefined){

                //console.log("Onnistui?! paluu juureen.");
                return res.status(302).redirect('/');
            } else {
                return res.render('alert', {
                    title:"Jotain meni pieleen",
                    returl:'/keskustelu_aiheesta',
                                dict:locale,
                                login: req.session.userid,                            
                                onLogPage:false,
                                onSignPage:false,
                                url:'/tietoa/?',
                                topikki:'',
                                p_uusin:false,
                                p_tiivis:false,
                                h_uusin:req.session.h_uusin,
                                h_tiivis:req.session.h_tiivis,
                                p_tietoa:true
                });
                //console.log("Pieleen meni");
            }
        });
    } else if(req.query.id!= undefined){
        db.findMessages(req.query.id,req.session.h_uusin,function(msg) {
            return res.status(200).render('keskustelu_aiheesta', { title: 'Keskustelu',
                                                    dict:locale,
                                                    login: req.session.userid,
                                                    messages:msg,
                                                    onLogPage:false,
                                                    onSignPage:false,
                                                    topikki:req.query.id,
                                                    url:'/keskustelu_aiheesta/?id='+req.query.id+'&',
                                                    p_uusin:true,
                                                    p_tiivis:true,
                                                    h_uusin:req.session.h_uusin,
                                                    h_tiivis:req.session.h_tiivis,
                                                    p_tietoa:true });
        });
    } else {
        return res.status(302).redirect('/');
    }
});

const omat_urls = [
    'omat_viestit',
    'own_messages'  
];

/* GET own messages page. */
router.get('/'+omat_urls.join('|')+'/:lang?', function(req, res) {
    // Check if user tries to control language
    var addToUrl = checkLang(req.params.lang);
    
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }

    if(req.query.h_uusin!= undefined){
        //console.log(req.query.h_uusin);
        req.session.h_uusin = (req.query.h_uusin=='true');

    } else if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }

    if(req.query.h_tiivis != undefined){
        req.session.h_tiivis = (req.query.h_tiivis == 'true');

    } else if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }

    if(req.query.delid != undefined){
        //console.log("poistetaan id: "+req.query.delid);
        db.deleteMessage(req.query.delid,req.session.userid,function(rvalue) {
            if(rvalue && req.query.v > 1){
                //console.log("Onnistui?! paluu keskusteluun.");
                db.findUserMsgs(req.session.userid,req.session.h_uusin,function(msg) {
                    return res.status(200).render('omat_viestit', { title: 'omat_viestit',
                          dict:locale,
                          login: req.session.userid,
                          messages:msg,
                          onLogPage:false,
                          onSignPage:false,
                          topikki:'',
                          url:'/omat_viestit/?',
                          p_uusin:true,
                          p_tiivis:true,
                          h_uusin:req.session.h_uusin,
                          h_tiivis:req.session.h_tiivis,
                          p_tietoa:true });
                });

            } else if (rvalue) {
                // It was the last message
                //console.log("Onnistui?! paluu juureen.");
                return res.status(302).redirect('/');
            } else {
                // There was an error
                return res.status(302).render('alert', {
                    title:"Jotain meni pieleen",
                    returl:'/omat_viestit',
                            dict:locale,
                             login: req.session.userid,                            
                             onLogPage:false,
                             onSignPage:false,
                             url:'/tietoa/?',
                             topikki:'',
                             p_uusin:false,
                             p_tiivis:false,
                             h_uusin:req.session.h_uusin,
                             h_tiivis:req.session.h_tiivis,
                             p_tietoa:true
                });
            }
        });
    } else if(req.session.userid!= undefined){
        db.findUserMsgs(req.session.userid,req.session.h_uusin,function(msg) {
            return res.status(200).render('omat_viestit', { 
                title: 'omat_viestit',
                dict:locale,
                  login: req.session.userid,
                  messages:msg,
                  onLogPage:false,
                  onSignPage:false,
                  topikki:'',
                  url:'/omat_viestit/?',
                  p_uusin:true,
                  p_tiivis:true,
                  h_uusin:req.session.h_uusin,
                  h_tiivis:req.session.h_tiivis,
                  p_tietoa:true });
        });
    } else {
        return res.status(302).redirect('/');
    }
});

const viesti_urls = [
    'uusi_viesti',
    'new_message'  
];

router.get('/'+viesti_urls.join('|')+'/:lang?', function(req, res, next) {
    // Check if user tries to control language
    var addToUrl = checkLang(req.params.lang);
    
    // Jos käyttäjä ei ole kirjautunut, ei voi kirjoittaa viestiä
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }
    // jos aihe on määritelty, on kirjoittaja jatkamassa viestiketjuun
    if(req.query.topic != undefined){
        db.findTopic(req.query.topic,function(msg) {
            return res.status(200).render('uusi_viesti', {
                title: 'Jatka keskustelua',
                dict:locale,
                  login: req.session.userid,
                  msgTopic:msg[0].topic,
                  msg:'',
                  msgId:'',
                  onLogPage:false,
                  onSignPage:false,
                  topikki:req.query.topic,  // Tämä on itseasiassa ID-numero hallintapaneelia varten
                  url:'/uusi_viesti/?topic='+req.query.topic+'&',
                  p_uusin:true,
                  p_tiivis:false,
                  h_uusin:req.session.h_uusin,
                  h_tiivis:req.session.h_tiivis,
                  p_tietoa:true });
        });
    // Jos on määritelty muokkaa-arvo, kirjoittaja haluaa muokata vanhaa viestiä
    } else if (req.query.muokkaa !=undefined){
        db.findSingleMsg(req.query.muokkaa,req.session.userid,function(msg) {
            return res.status(200).render('uusi_viesti', { title: 'Muokkaa viestiä',
                dict:locale,
                  login: req.session.userid,
                  msgTopic:msg[0].topic,
                  msg:msg[0].message,
                  msgId:msg[0].id,
                  onLogPage:false,
                  onSignPage:false,
                  topikki:'',
                  url:'/uusi_viesti/?muokkaa='+req.query.muokkaa+'&',
                  p_uusin:true,
                  p_tiivis:false,
                  h_uusin:req.session.h_uusin,
                  h_tiivis:req.session.h_tiivis,
                  p_tietoa:true });
        });
    } else {
        // Muussa tapauksessa kirjoittaja aloittaa uuden viestiketjun
        

        return res.status(200).render('uusi_viesti', {
            title: 'Kirjoita uusi viesti',
            dict:locale,
              login: req.session.userid,
              onLogPage:false,
              onSignPage:false,
              url:'/uusi_viesti/?',
              msgTopic:'',
              msg:'',
              msgId:'',
              topikki:'',
              p_uusin:true,
              p_tiivis:false,
              h_uusin:req.session.h_uusin,
              h_tiivis:req.session.h_tiivis,
              p_tietoa:true });
    }
});

router.post('/'+viesti_urls.join('|')+'/:lang?', function(req, res, next) {
    // Check if user tries to control language
    var addToUrl = checkLang(req.params.lang);
    
    //console.log(req.body);
    if(req.body.muokkaa.length >0) {
        //console.log("Edit-tallennus. "+req.toString());
        db.editMessage(req.body, function(rvalue) {
            if(rvalue)
                return res.status(302).redirect('/keskustelu_aiheesta/?id='+req.body.muokkaa);
            else
                return res.status(400).render('alert', {
                    title:"Jotain meni pieleen",
                    dict:locale,
                    returl:'/uusi_viesti',
                     login: req.session.userid,                            
                     onLogPage:false,
                     onSignPage:false,
                     url:'/tietoa/?',
                     topikki:'',
                     p_uusin:false,
                     p_tiivis:false,
                     h_uusin:req.session.h_uusin,
                     h_tiivis:req.session.h_tiivis,
                     p_tietoa:true
                });
        });
    } else {
        //console.log("Uuden viestin tallennus.");
        db.createMessage(req.body, function(rvalue) {
            if(rvalue && req.body.topikki.length ==0)
                return res.status(302).redirect('/');
            else if (rvalue)
                return res.status(302).redirect('/keskustelu_aiheesta/?id='+req.body.topikki);
            else {
                return res.status(400).render('alert', {
                    title:"Jotain meni pieleen",
                    dict:locale,
                    returl:'/uusi_viesti'
                });
            }
        });
    }
});


module.exports = router;
