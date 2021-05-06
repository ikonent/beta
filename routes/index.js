var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../dbOperations');                        // Needed for database connection
const Localization = require("localizationjs");             // Needed for localization
const locale = new Localization({ defaultLocale: "fi" });   // Localization object to store dictionaries and information about locale

//Dictionaries
const dictionaryFI = require('../languages/fi');            // Dictionary for Finnish
const dictionaryEN = require('../languages/en');            // Dictionary for English
// create a locale manager

// Globaalit muuttujat

// add the dictionaries
locale.addDict("fi", dictionaryFI);                         //  Add Finnish dictionary to locale
locale.addDict("en", dictionaryEN);                         //  Add English dictionary to locale


/* GET home page. */
router.get('/:lang([a-z]{2})?/', function(req, res, next) {
    /*
        Display index page
        // Check if language is set in URI
    */
    // Check if there is an effort to change lang
    var add2Url ='';                                        // Variable for locale-information to be used for href
    if(req.session.locale === undefined) {                  // Check if value locale-string (EN or FI) is stored in session
        if (req.params.lang !== undefined && locale.hasDict(req.params.lang)) {     //  Check if requested URI has locale set
            req.session.locale = req.params.lang;                                   //  Assign locale in URI to session 
            locale.setCurrentLocale(req.session.locale);                            //  Set current locale
        } else if (locale.getCurrentLocale()!==undefined){
            req.session.locale = locale.getCurrentLocale().language;                //  Pick current locale to session locale String
        } else {
            req.session.locale = locale.getDefaultLocale().language;                //  Set session locale-String to match default locale
            locale.setCurrentLocale(locale.getDefaultLocale().language);            //  Set current locale to match default locale
        }
    } else if(req.params.lang !== undefined && locale.hasDict(req.params.lang) && req.session.locale != req.params.lang ) {
        req.session.locale = req.params.lang;                                       //  Set session locale-string to match language setting in URI
        locale.setCurrentLocale(req.session.locale);                                //  Set current locale to match session locale-String
        
    }
    // Change url-variable to have lang-parameter in urls
    if(req.session.locale != locale.getDefaultLocale()){
        add2Url = req.session.locale+'/';  // JOS ei oletuskieli, NIIN annetaan täydennysURL:iin
    }
    

    
    // Check if session has user ID stored
    if(req.session.userid === undefined || req.session.userid == "") {
        // Set session user ID to null = user has not logged in
        req.session.userid = null;
    }
    
    // Check if there is a parameter for 'Newest first / Oldest first' setting in URI
    if(req.query.h_uusin!= undefined){
        // If set, store in session
        req.session.h_uusin = (req.query.h_uusin=='true'); // value comes as string and needs to be converted into boolean
    } else if (req.session.h_uusin === undefined) {
        // If not set, set value to true
        req.session.h_uusin = true;
    }
    
     // Check if there is a parameter for 'truncate / expand messages' setting in URI
    if(req.query.h_tiivis != undefined){
        req.session.h_tiivis = (req.query.h_tiivis == 'true'); // value comes as string and needs to be converted into boolean
    } else if (req.session.h_tiivis === undefined) {
        // If not set, set value to false
        req.session.h_tiivis = false;
    }
    //console.log("jotain tapahtu "+req.session.h_uusin);
    db.findTitles(req.session.h_uusin,function(msg) {
        return res.status(200).render('index', {    
            dict:locale,                            // Locale and dictionaries
            addToUrl:add2Url,                       // locale-name information for URI. Format: 'fi/'
            title: locale.translate('index.title'), // Title of page
            login: req.session.userid,              // Information about logged user - this is probably stored on a cookie but I couldn't access it
            messages: msg,                          // Array of messages - or message topics in this case
            topikki:'',                             // Name of the topic that is currently viewed. Actually valid only on 'keskustelu_aiheesta'
            currUrl:'/',                            // reference to current page
            urlSuffix:'?',                          // Value to add last on buttons with href to (current) page
            onLogPage:false,                        // Variable to tell UI buttons in hallinta.ejs that this is not log in-page
            onSignPage:false,                       // Variable to tell UI buttons in hallinta.ejs that this is not add user-page
            p_uusin:true,                           // Is newest message on top button visible
            p_tiivis:false,                         // Is condense messages button visible
            h_uusin:req.session.h_uusin,            // value of newest on top button
            h_tiivis:req.session.h_tiivis,          // value of condense messages button
            p_tietoa:true   
        }); 
    });
});
// Variable has uri names for about pages
// It would be better if these values were derived from the dictionaries
const tietoa_urls = [
    'tietoa',
    'about'
];
// '(/:lang(en|fi))?/'+locale.translate("urls.tietoa")
/* GET about page. */
router.get('/:page('+tietoa_urls.join('|')+')/:lang([a-z]{2})?/', function(req, res) {
    // Check if there is an effort to change lang
    var add2Url ='';
    if(req.session.locale === undefined) {
        if (req.params.lang !== undefined && locale.hasDict(req.params.lang)) {
            req.session.locale = req.params.lang;
            locale.setCurrentLocale(req.session.locale);
        } else if (locale.getCurrentLocale()!==undefined){
            console.log("nykyinne "+locale.getCurrentLocale().language)
            req.session.locale = locale.getCurrentLocale().language;
        } else {
            req.session.locale = locale.getDefaultLocale().language;
            locale.setCurrentLocale(locale.getDefaultLocale().language);
        }
    } else if(req.params.lang !== undefined && locale.hasDict(req.params.lang) && req.session.locale != req.params.lang ) {
        req.session.locale = req.params.lang;
        locale.setCurrentLocale(req.session.locale);
        
    }
    // Change url-variable to have lang-parameter in urls
    if(req.session.locale != locale.getDefaultLocale()){
        add2Url = req.session.locale+'/';  // JOS ei oletuskieli, NIIN annetaan täydennysURL:iin
    }
    
    
    
    console.log("lisä "+add2Url);
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }
    return res.status(200).render('tietoa', { title: 'Ruotijat - '+locale.translate("tietoa.title"),
                                             login: req.session.userid,
                                             dict:locale,
                                             addToUrl:add2Url,
                                             onLogPage:false,
                                             onSignPage:false,
                                             currUrl:'/'+locale.translate("urls.tietoa")+'/',
                                            urlSuffix:'?',
                                             topikki:'',
                                             p_uusin:false,
                                             p_tiivis:false,
                                             h_uusin:req.session.h_uusin,
                                             h_tiivis:req.session.h_tiivis,
                                             p_tietoa:true
                                            });
});

const keskustelu_aiheesta_urls = [
    'keskustelu_aiheesta',
    'on_topic'
];
// jemmaan tämä reg exp: (/:lang(fi))?

/* GET about page. */
router.get('/:page('+keskustelu_aiheesta_urls.join('|')+')/:lang([a-z]{2})?/', function(req, res) {
    // Check if there is an effort to change lang
    var add2Url =''
     if(req.session.locale === undefined) {
        if (req.params.lang !== undefined && locale.hasDict(req.params.lang)) {
            req.session.locale = req.params.lang;
            locale.setCurrentLocale(req.session.locale);
        } else if (locale.getCurrentLocale()!==undefined){
            req.session.locale = locale.getCurrentLocale().language;
        } else {
            req.session.locale = locale.getDefaultLocale().language;
            locale.setCurrentLocale(locale.getDefaultLocale().language);
        }
    } else if(req.params.lang !== undefined && locale.hasDict(req.params.lang) && req.session.locale != req.params.lang ) {
        req.session.locale = req.params.lang;
        locale.setCurrentLocale(req.session.locale);
        
    }
    // Change url-variable to have lang-parameter in urls
    if(req.session.locale != locale.getDefaultLocale()){
        add2Url = req.session.locale+'/';  // JOS ei oletuskieli, NIIN annetaan täydennysURL:iin
    }

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
        db.deleteMessage(req.query.delid, req.session.userid, function(rvalue) {
            if(rvalue && req.query.id != undefined){
                return res.status(302).redirect('./?id='+req.query.id);

            } else if (req.query.id === undefined){
                return res.status(302).redirect('/');
            } else {
                return res.render('alert', {
                    title:locale.translate("alert.pieleenMeni"),
                    returl:'/'+locale.translate("urls.keskustelu"),
                    dict:locale,
                    addToUrl:add2Url,
                    login: req.session.userid,                            
                    onLogPage:false,
                    onSignPage:false,
                    currUrl:'/'+locale.translate("urls.tietoa")+'/',
                    urlSuffix:'?',
                    topikki:'',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
                });
            }
        });
    } else if(req.query.id!= undefined){
        db.findMessages(req.query.id,req.session.h_uusin,function(msg) {
            return res.status(200).render('keskustelu_aiheesta', { title: 'Keskustelu',
                dict:locale,
                addToUrl:add2Url,
                login: req.session.userid,
                messages:msg,
                onLogPage:false,
                onSignPage:false,
                topikki:req.query.id,
                currUrl:'/'+locale.translate("urls.keskustelu")+'/',
                urlSuffix:'?id='+req.query.id+'&',
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
router.get('/:page('+omat_urls.join('|')+')/:lang([a-z]{2})?/', function(req, res) {
    // Check if there is an effort to change lang
    var add2Url =''
     if(req.session.locale === undefined) {
        if (req.params.lang !== undefined && locale.hasDict(req.params.lang)) {
            req.session.locale = req.params.lang;
            locale.setCurrentLocale(req.session.locale);
        } else if (locale.getCurrentLocale()!==undefined){
            req.session.locale = locale.getCurrentLocale().language;
        } else {
            req.session.locale = locale.getDefaultLocale().language;
            locale.setCurrentLocale(locale.getDefaultLocale().language);
        }
    } else if(req.params.lang !== undefined && locale.hasDict(req.params.lang) && req.session.locale != req.params.lang ) {
        req.session.locale = req.params.lang;
        locale.setCurrentLocale(req.session.locale);
        
    }
    // Change url-variable to have lang-parameter in urls
    if(req.session.locale != locale.getDefaultLocale()){
        add2Url = req.session.locale+'/';  // JOS ei oletuskieli, NIIN annetaan täydennysURL:iin
    }
    
    
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
                    return res.status(200).render('omat_viestit', {                 title:locale.translate("omat.title"),
                           dict:locale,
                           addToUrl:add2Url,
                           login: req.session.userid,
                           messages:msg,
                           onLogPage:false,
                           onSignPage:false,
                           topikki:'',
                           currUrl:'/'+locale.translate("urls.omat")+'/',
                          urlSuffix:'?',
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
                    returl:'/'+locale.translate("urls.omat")+addToUrl,
                    dict:locale,
                                addToUrl:add2Url,
                    login: req.session.userid,                            
                    onLogPage:false,
                    onSignPage:false,
                    currUrl:'/'+locale.translate("urls.omat")+'/',
                    urlSuffix:'?',
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
                title: locale.translate("urls.omat"),
                dict:locale,
                addToUrl:add2Url,
                login: req.session.userid,
                messages:msg,
                onLogPage:false,
                onSignPage:false,
                topikki:'',
                currUrl:'/'+locale.translate("urls.omat")+'/',
                urlSuffix:'?',
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

router.get('/:page('+viesti_urls.join('|')+')/:lang([a-z]{2})?/', function(req, res, next) {
    /// Check if there is an effort to change lang
    var add2Url =''
     if(req.session.locale === undefined) {
        if (req.params.lang !== undefined && locale.hasDict(req.params.lang)) {
            req.session.locale = req.params.lang;
            locale.setCurrentLocale(req.session.locale);
        } else if (locale.getCurrentLocale()!==undefined){
            req.session.locale = locale.getCurrentLocale().language;
        } else {
            req.session.locale = locale.getDefaultLocale().language;
            locale.setCurrentLocale(locale.getDefaultLocale());
        }
    } else if(req.params.lang !== undefined && locale.hasDict(req.params.lang) && req.session.locale != req.params.lang ) {
        req.session.locale = req.params.lang;
        locale.setCurrentLocale(req.session.locale);
        
    }
    // Change url-variable to have lang-parameter in urls
    if(req.session.locale != locale.getDefaultLocale()){
        add2Url = req.session.locale+'/';  // JOS ei oletuskieli, NIIN annetaan täydennysURL:iin
    }


    // Jos käyttäjä ei ole kirjautunut, ei voi kirjoittaa viestiä
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }
    // jos aihe on määritelty, on kirjoittaja jatkamassa viestiketjuun
    if(req.query.topic != undefined){
        db.findTopic(req.query.topic,function(msg) {
            return res.status(200).render('uusi_viesti', {
                title: locale.translate("jatka.title"),
                dict:locale,
                addToUrl:add2Url,
                login: req.session.userid,
                msgTopic:msg[0].topic,
                msg:'',
                msgId:'',
                onLogPage:false,
                onSignPage:false,
                topikki:req.query.topic,  // Tämä on itseasiassa ID-numero hallintapaneelia varten
                currUrl:'/'+locale.translate("urls.uusi_viesti")+'/',
                urlSuffix:'?topic='+req.query.topic+'&',
                p_uusin:true,
                p_tiivis:false,
                h_uusin:req.session.h_uusin,
                h_tiivis:req.session.h_tiivis,
                p_tietoa:true });
        });
        // Jos on määritelty muokkaa-arvo, kirjoittaja haluaa muokata vanhaa viestiä
    } else if (req.query.muokkaa !=undefined){
        db.findSingleMsg(req.query.muokkaa,req.session.userid,function(msg) {
            return res.status(200).render('uusi_viesti', { title: locale.translate("muokkaa.title"),
                  dict:locale,
                  addToUrl:add2Url,
                  login: req.session.userid,
                  msgTopic:msg[0].topic,
                  msg:msg[0].message,
                  msgId:msg[0].id,
                  onLogPage:false,
                  onSignPage:false,
                  topikki:'',
                  currUrl:'/'+locale.translate("urls.uusi_viesti")+'/',
                  urlSuffix:'?muokkaa='+req.query.muokkaa+'&',
                  p_uusin:true,
                  p_tiivis:false,
                  h_uusin:req.session.h_uusin,
                  h_tiivis:req.session.h_tiivis,
                  p_tietoa:true });
        });
    } else {
        // Muussa tapauksessa kirjoittaja aloittaa uuden viestiketjun
        return res.status(200).render('uusi_viesti', {
            title: locale.translate("uusi_viesti.title"),
            dict:locale,
                                addToUrl:add2Url,
            login: req.session.userid,
            onLogPage:false,
            onSignPage:false,
            currUrl:'/'+locale.translate("urls.uusi_viesti")+'/',
            urlSuffix:'?',
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

router.post('/:page('+viesti_urls.join('|')+')/:lang([a-z]{2})?/', function(req, res, next) {
   // Check if there is an effort to change lang
    var add2Url =''
     if(req.session.locale === undefined) {
        if (req.params.lang !== undefined && locale.hasDict(req.params.lang)) {
            req.session.locale = req.params.lang;
            locale.setCurrentLocale(req.session.locale);
        } else if (locale.getCurrentLocale()!==undefined){
            req.session.locale = locale.getCurrentLocale();
        } else {
            req.session.locale = locale.getDefaultLocale();
            locale.setCurrentLocale(locale.getDefaultLocale());
        }
    } else if(req.params.lang !== undefined && locale.hasDict(req.params.lang) && req.session.locale != req.params.lang ) {
        req.session.locale = req.params.lang;
        locale.setCurrentLocale(req.session.locale);
        
    }
    // Change url-variable to have lang-parameter in urls
    if(req.session.locale != locale.getDefaultLocale()){
        add2Url = req.session.locale+'/';  // JOS ei oletuskieli, NIIN annetaan täydennysURL:iin
    }
    

    //console.log(req.body);
    if(req.body.muokkaa.length >0) {
        //console.log("Edit-tallennus. "+req.toString());
        db.editMessage(req.body, function(rvalue) {
            if(rvalue)
                return res.status(302).redirect('/'+locale.translate("urls.keskustelu")+'/'+add2Url+'?id='+req.body.muokkaa);
            else
                return res.status(400).render('alert', {
                    title:locale.translate("alerts.pieleenMeni"),
                    dict:locale,
                                addToUrl:add2Url,
                    returl:'/'+locale.translate("urls.uusi_viesti")+'/'+add2Url+'?',
                    login: req.session.userid,                            
                    onLogPage:false,
                    onSignPage:false,
                    currUrl:'/'+locale.translate("urls.alert")+'/',
            urlSuffix:'?',
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
                return res.status(302).redirect('/'+locale.translate("urls.keskustelu")+'/?id='+req.body.topikki);
            else {
                return res.status(400).render('alert', {
                    title:locale.translate("alert.pieleenMeni"),
                    dict:locale,
                    addToUrl:add2Url,
                    returl:'/'+locale.translate("urls.uusi_viesti")+'/'+add2Url
                });
            }
        });
    }
});


module.exports = router;
