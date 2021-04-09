var express = require('express');
var session = require('express-session');
var router = express.Router();
var db = require('../dbOperations');


router.get('/login', function(req, res, next) {
	if( req.session.userid == null )
		return res.render('login', {
			title: 'Kirjaudu',
			login: req.session.userid
		});
	else {
		req.session.destroy();
		return res.redirect('/');
	}
});


router.post('/login', (req, res) => {
	db.verifyUserId(req, function (data) {
		console.log(data);
		if (data == "Access denied") {
			return res.render('alert', {
				title: 'Tietokantaan ei saa nyt yhteyttä. Yritä myöhemmin uudestaan',
				login: req.session.userid
			});	
		} else if (data == "not exist") {
			return res.render('register', {
				title: 'Tietojasi ei löytynyt. Rekisteröidy ennen käyttöä!',
				login: req.session.userid
			});
		} else if (data == "not valid") {
			return res.render('alert', {
				title: 'Salasana ei täsmää?',
				login: req.session.userid
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

router.get('/register', function(req, res, next) {
		return res.render('register', {
			title: 'Rekisteröidä',
			login: req.session.userid
		});
});


router.post('/register', (req, res) => {
	db.registerUser(req, function (data) {
		console.log(data);
		return res.render('login', {
			title: 'Käyttäjä on rekisteröity. Kirjaudu sisään',
			login: req.session.userid
			
		});
	});
});

//////////////////
router.get('/logout', function(req, res, next) {
		req.session.destroy();
		return res.redirect('/');
});


module.exports = router;
