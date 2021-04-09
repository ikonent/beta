
var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var db = require('../dbOperations');
//var Message = require('../dbOperations').Message;
var session = require('express-session');



/* GET home page. */

router.get('/about', function(req,res,next) {
	return res.render('about', {
		title: "Meistä",
		login: req.session.userid
	});
});


router.get('/', function(req, res, next) {
	if(req.session.userid === undefined) {
		req.session.userid = null;
	}
	db.findMessages(function(msg) {
		return res.render('index', {
			title: 'Kaikki viestit',
			login: req.session.userid,
			messages: msg 
		});
	});
});

router.get('/post', function(req, res, next) {
	return res.render('postform', {
		title: 'Kirjoita ja lähetä viesti',
		login: req.session.userid
	});
});


router.post('/post', function(req, res, next) {
	db.createMessage(req.body, function(rvalue) {
		if(rvalue)
			return res.redirect('/');
		else
			console.log("Pieleen meni");
	});
});


router.get('/patch', function(req, res, next) {
	return res.render('postform', {
		title: 'Muokkaa ja lähetä viesti',
		login: req.session.userid,
		messages: msg 
	});
});


router.post('/patch', function(req, res, next) {
	db.modifyMessage(req.body, function(data) {
		if(data)
			return res.redirect('/');
		else
			console.log("Pieleen meni");
	});
});





module.exports = router;

