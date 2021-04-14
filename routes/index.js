var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../dbOperations');

// Globaalit muuttujat



/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log(req);
    //console.log(res);
    //console.log(req.query);

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
        return res.render('index', {
            title: 'Kaikki viestit',
            login: req.session.userid,
            messages: msg,
            topikki:'',
            url:'?',
            onLogPage:false,
            onSignPage:false,
            p_uusin:true,
            p_tiivis:false,
            h_uusin:req.session.h_uusin,
            h_tiivis:req.session.h_tiivis,
            p_tietoa:true
        }); 
    });
});



/* GET about page. */
router.get('/tietoa', function(req, res) {
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }
    return res.render('tietoa', { title: 'Ruotijat - tietoa',
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

/* GET about page. */
router.get('/keskustelu_aiheesta', function(req, res) {
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }

    if(req.query.h_uusin!= undefined){
        console.log(req.query.h_uusin);
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
        console.log("poistetaan id: "+req.query.delid);
        db.deleteMessage(req.query.delid,function(rvalue) {
            if(rvalue && req.query.id != undefined){
                console.log("Onnistui?! paluu keskusteluun.");
                return res.redirect('./?id='+req.query.id);

            } else if (req.query.id === undefined){

                console.log("Onnistui?! paluu juureen.");
                return res.redirect('/');
            } else {
                console.log("Pieleen meni");
            }
        });
    } else if(req.query.id!= undefined){
        db.findMessages(req.query.id,req.session.h_uusin,function(msg) {
            return res.render('keskustelu_aiheesta', { title: 'Keskustelu',
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
        return res.redirect('/');
    }
});

router.get('/uusi_viesti', function(req, res, next) {
    if(req.session.userid === undefined || req.session.userid == "") {
        req.session.userid = null;
    }

    if(req.query.topic != undefined){
        db.findTopic(req.query.topic,function(msg) {
            return res.render('uusi_viesti', { title: 'Jatka keskustelua',
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

    } else if (req.query.muokkaa !=undefined){
        db.findSingleMsg(req.query.muokkaa,function(msg) {
            return res.render('uusi_viesti', { title: 'Muokkaa viestiä',
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



        return res.render('uusi_viesti', { title: 'Kirjoita uusi viesti',
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

router.post('/uusi_viesti', function(req, res, next) {
    console.log(req.body);
    if(req.body.muokkaa.length >0) {
        console.log("Edit-tallennus.");
        db.editMessage(req.body, function(rvalue) {
            if(rvalue)
                return res.redirect('/keskustelu_aiheesta/?id='+req.body.muokkaa);
            else
                console.log("Pieleen meni");
        });
    } else {
        console.log("Uuden viestin tallennus.");
        db.createMessage(req.body, function(rvalue) {
            if(rvalue && req.body.topikki.length ==0)
                return res.redirect('/');
            else if (rvalue)
                return res.redirect('/keskustelu_aiheesta/?id='+req.body.topikki);
            else
                console.log("Pieleen meni");
        });
    }
});


module.exports = router;
