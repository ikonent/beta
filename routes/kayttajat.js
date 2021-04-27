var express = require('express');
var session = require('express-session');
var router = express.Router();
var db = require('../dbOperations');

router.get('/kirjautuminen', function(req, res, next) {
    
    if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }
    if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }
    
	if( req.session.userid == null )
		return res.status(200).render('kirjautuminen', {
			title: 'Kirjaudu',
			login: req.session.userid,
            onLogPage:true,
            onSignPage:false,
            topikki:'',
            url:'/kayttajat/kirjautuminen/?',
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

router.get('/rekisteroityminen', function(req, res, next) {
    
    if (req.session.h_uusin === undefined) {
        req.session.h_uusin = true;
    }
    if (req.session.h_tiivis === undefined) {
        req.session.h_tiivis = false;
    }
    
	if( req.session.userid == null )
		return res.status(200).render('rekisteroityminen', {
			title: 'Luo Käyttäjätunnus',
			login: req.session.userid,
            onLogPage:false,
            onSignPage:true,
            topikki:'',
            url:'/kayttajat/rekisteroityminen/?',
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

router.post('/kirjautuminen', (req, res) => {
    db.verifyUserId(req, function (data) {
        if (data == "Access denied") {
            return res.status(500).render('alert', {
                title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan.',
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
        } else if (data == "not exist") {
            return res.status(404).render('alert', {
                title: 'Tietojasi ei löytynyt. Rekisteröidy ennen käyttöä!',
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
        } else if (data == "not valid") {
            return res.status(406).render('alert', {
                title: 'Salasana ei täsmää!',
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

router.post('/rekisteroityminen', (req, res) => {
        db.registerUser(req, function(data) {
            switch(data) {
                case "Access denied":
                    return res.status(500).render('alert', {
                        title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan.',
                        returl: "/kayttajat/rekisteroityminen",
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
