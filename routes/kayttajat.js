var express = require('express');
var session = require('express-session');
var router = express.Router();
var db = require('../dbOperations');
const Localization = require("localizationjs");

//Dictionaries
const dictionaryFI = require('../languages/fi');
const dictionaryEN = require('../languages/en');
// create a locale manager
const locale = new Localization({ defaultLocale: "en" });



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



const kirj_urls = [
    'kirjautuminen',
    'log_in'
];

router.get('/'+kirj_urls.join('|')+'/:lang?', function(req, res, next) {
    console.log("d "+req.url);
    
    // Check if there is an effort to change lang
    var addToUrl = checkLang(req.params.lang);
    
    if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }
    if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }
    
	if( req.session.userid == null )
		return res.status(200).render('kirjautuminen', {
			title: locale.translate("urls.otsikkoSisaan"),
            dict:locale, 
			login: req.session.userid,
            onLogPage:true,
            onSignPage:false,
            topikki:'',
            url:addToUrl+'/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.kirjautuminen")+'/?',
            p_uusin:false,
            p_tiivis:false,
            h_uusin:req.session.h_uusin,
            h_tiivis:req.session.h_tiivis,
            p_tietoa:true
		});
	else {
		req.session.destroy();
		return res.status(302).redirect('/');
	}
});

const uusiKayttaja_urls = [
    'rekisteroityminen',
    'add_user'
];

router.get('/'+uusiKayttaja_urls.join('|')+'/:lang?', function(req, res, next) {
    // Check if there is an effort to change lang
    var addToUrl = checkLang(req.params.lang);
    
    if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }
    if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }
    
	if( req.session.userid == null )
		return res.status(200).render('rekisteroityminen', {
			title: 'Luo Käyttäjätunnus',
            dict:locale, 
			login: req.session.userid,
            onLogPage:false,
            onSignPage:true,
            topikki:'',
            url:addToUrl+'/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.rekisteroityminen")+'/?',
            p_uusin:false,
            p_tiivis:false,
            h_uusin:req.session.h_uusin,
            h_tiivis:req.session.h_tiivis,
            p_tietoa:true
		});
	else {
		req.session.destroy();
		return res.status(302).redirect('/');
	}
});

router.post('/'+kirj_urls.join('|')+'/:lang?', (req, res) => {
    db.verifyUserId(req, function (data) {
        if (data == "Access denied") {
            return res.status(500).render('alert', {
                title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan.',
                    returl: "/kayttajat/kirjautuminen",
                    dict:locale, 
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    url:'/alert/?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
            });	
        } else if (data == "not exist") {
            return res.status(404).render('alert', {
                title: 'Tietojasi ei löytynyt. Rekisteröidy ennen käyttöä!',
                    returl: "/kayttajat/kirjautuminen",
                    dict:locale, 
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    url:'/alert/?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
            });
        } else if (data == "not valid") {
            return res.status(406).render('alert', {
                title: 'Salasana ei täsmää!',
                    dict:locale, 
                    returl: "/kayttajat/kirjautuminen",
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    url:'/alert/?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
            });	
        } else if (data == "exist") {
            req.session.userid = req.body.userid;
            return res.status(302).redirect('/');
        } else {
            return res.status(400).render('alert', {
                    title:"Jotain meni pieleen",
                    returl: "/kayttajat/kirjautuminen",
                    dict:locale, 
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    url:'/alert/?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
                });
        };
    });
});

router.post('/'+uusiKayttaja_urls.join('|')+'/:lang?', (req, res) => {
        db.registerUser(req, function(data) {
            switch(data) {
                case "Access denied":
                    return res.status(500).render('alert', {
                        title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan.',
                        returl: "/kayttajat/rekisteroityminen",
                        dict:locale, 
                        login: req.session.userid,
                        onLogPage:false,
                        onSignPage:true,
                        topikki:'',
                        url:'/alert/?',
                        p_uusin:false,
                        p_tiivis:false,
                        h_uusin:req.session.h_uusin,
                        h_tiivis:req.session.h_tiivis,
                        p_tietoa:true
                    });	
                    break;
                case "Username already exists":
                    return res.status(409).render('alert', {
                        title: 'Samanniminen käyttäjä on jo olemassa.',
                        returl: "/kayttajat/rekisteroityminen",
                        dict:locale, 
                        login: req.session.userid,
                        onLogPage:false,
                        onSignPage:true,
                        topikki:'',
                        url:'/alert/?',
                        p_uusin:false,
                        p_tiivis:false,
                        h_uusin:req.session.h_uusin,
                        h_tiivis:req.session.h_tiivis,
                        p_tietoa:true
                    });	
                    break;
                default:
                    req.session.userid = req.body.userid;
                    return res.status(302).redirect('/');
            }
        });
});

module.exports = router;
