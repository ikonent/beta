var express = require('express');
var session = require('express-session');
var router = express.Router();
var db = require('../dbOperations');
const Localization = require("localizationjs");

//Dictionaries
const dictionaryFI = require('../languages/fi');
const dictionaryEN = require('../languages/en');
// create a locale manager
const locale = new Localization({ defaultLocale: "fi" });



// Globaalit muuttujat

// add the dictionaries
locale.addDict("fi", dictionaryFI);
locale.addDict("en", dictionaryEN);

const kirj_urls = [
    'kirjautuminen',
    'log_in'
];

router.get('/'+kirj_urls.join('|')+'/:lang([a-z]{2})?', function(req, res, next) {
    console.log("d "+req.url);
    
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
            addToUrl:add2Url,
			login: req.session.userid,
            onLogPage:true,
            onSignPage:false,
            topikki:'',
           currUrl:'/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.kirjautuminen")+'/',
            urlSuffix:'?',
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
    'registration'
];

router.get('/'+uusiKayttaja_urls.join('|')+'/:lang([a-z]{2})?', function(req, res, next) {
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
    
    
    if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }
    if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }
    
	if( req.session.userid == null )
		return res.status(200).render('rekisteroityminen', {
			title: locale.translate("uusi_kayttaja.title"),
            dict:locale, 
            addToUrl:add2Url,
			login: req.session.userid,
            onLogPage:false,
            onSignPage:true,
            topikki:'',
           currUrl:'/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.rekisteroityminen")+'/',
            urlSuffix:'?',
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

router.post('/'+kirj_urls.join('|')+'/:lang([a-z]{2})?', (req, res) => {
    db.verifyUserId(req, function (data) {
        if (data == "Access denied") {
            return res.status(500).render('alert', {
                title: locale.translate("alerts.yhteysPoikkiDb"),
                    returl: '/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.kirjautuminen")+add2Url,
                    dict:locale, 
                    addToUrl:add2Url,
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    currUrl:'/'+dict.translate("urls.alert")+'/',
                    urlSuffix:'?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
            });	
        } else if (data == "not exist") {
            return res.status(404).render('alert', {
                title: locale.translate("alerts.eiKayttajatunnusta"),
                    returl: '/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.kirjautuminen")+add2Url,
                    dict:locale, 
                                addToUrl:add2Url,
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    currUrl:'/'+locale.translate("urls.alert")+'/',
                    urlSuffix:'?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
            });
        } else if (data == "not valid") {
            return res.status(406).render('alert', {
                title: locale.translate("alerts.salasanaVaarin"),
                    dict:locale, 
                                addToUrl:add2Url,
                    returl: '/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.kirjautuminen")+add2Url,
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    currUrl:'/'+locale.translate("alert")+'/',
                    urlSuffix:'?',
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
                    title:locale.translate("alerts.pieleenMeni"),
                    returl: '/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.kirjautuminen")+add2Url,
                    dict:locale, 
                    addToUrl:add2Url,
                    virhe:data,
                    login: req.session.userid,
                    onLogPage:false,
                    onSignPage:true,
                    topikki:'',
                    currUrl:'/'+locale.translate("alert")+'/',
                    urlSuffix:'?',
                    p_uusin:false,
                    p_tiivis:false,
                    h_uusin:req.session.h_uusin,
                    //h_tiivis:req.session.h_tiivis,
                    p_tietoa:true
                });
        };
    });
});

router.post('/'+uusiKayttaja_urls.join('|')+'/:lang([a-z]{2})?', (req, res) => {
        db.registerUser(req, function(data) {
            switch(data) {
                case "Access denied":
                    return res.status(500).render('alert', {
                        title: locale.translate("alerts.yhteysPoikkiDb"),
                        returl: '/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.rekisteroityminen")+add2Url,
                        dict:locale, 
                                addToUrl:add2Url,
                        login: req.session.userid,
                        onLogPage:false,
                        onSignPage:true,
                        topikki:'',
                        currUrl:'/'+locale.translate("alert")+'/',
                        urlSuffix:'?',
                        p_uusin:false,
                        p_tiivis:false,
                        h_uusin:req.session.h_uusin,
                        //h_tiivis:req.session.h_tiivis,
                        p_tietoa:true
                    });	
                    break;
                case "Username already exists":
                    return res.status(409).render('alert', {
                        title: locale.translate("alerts.tunnusOlemassa"),
                        returl: '/'+locale.translate("urls.kayttajat")+'/'+locale.translate("urls.rekisteroityminen")+add2Url,
                        dict:locale, 
                                addToUrl:add2Url,
                        login: req.session.userid,
                        onLogPage:false,
                        onSignPage:true,
                        topikki:'',
                        currUrl:'/'+locale.translate("alert")+'/',
                        urlSuffix:'?',
                        p_uusin:false,
                        p_tiivis:false,
                        h_uusin:req.session.h_uusin,
                        //h_tiivis:req.session.h_tiivis,
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
