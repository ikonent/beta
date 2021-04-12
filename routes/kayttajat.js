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
		return res.render('kirjautuminen', {
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
		return res.redirect('/');
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
		return res.render('rekisteroityminen', {
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
		return res.redirect('/');
	}
});

router.post('/kirjautuminen', (req, res) => {
    db.verifyUserId(req, function (data) {
        if (data == "Access denied") {
            return res.render('alert', {
                title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan.'
            });	
        } else if (data == "not exist") {
            return res.render('register', {
                title: 'Tietojasi ei löytynyt. Rekisteröidy ennen käyttöä!'
            });
        } else if (data == "not valid") {
            return res.render('alert', {
                title: 'Salasana ei täsmää?'
            });	
        } else if (data == "exist") {
            req.session.userid = req.body.userid;
            return res.redirect('/');
        } else {
            return res.render('error', {
                message: 'Virhetoiminto: Ota yhteyttä järjestelmän ylläpitäjään',
                error: data
            });
        };
    });
});

router.post('/rekisteroityminen', (req, res) => {
        db.registerUser(req, function(data) {
            switch(data) {
                case "Access denied":
                    return res.render('alert', {
                        title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan.'
                    });	
                    break;
                case "Username already exists":
                    return res.render('alert', {
                        title: 'Samanniminen käyttäjä on jo olemassa.'
                    });	
                    break;
                default:
                    req.session.userid = req.body.userid;
                    return res.redirect('/');
            }
        });
});

module.exports = router;
