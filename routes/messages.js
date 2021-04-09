var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var db = require('../dbOperations');

/* GET - palauta kaikki tiedot. */

router.get('/', function(req, res) {
    db.findMessages(function( result ) {
//		res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.json( result )
    });
});

router.post('/', function(req, res, next) {
    db.createMessage( req.body, function( data ) {
        if(data)
    		res.status(201).send({message: "Viesti lähetetty! Paina logo jatkaaksesti."});
        else
			res.status(403).send({error: "Viestin lähetys epäonnistui! Ota yhteyttä ylläpitoon. Paina logo jatkaaksesti."});
    });
});

/* GET - palauta yksittäisen viestin tiedot */
/*router.get('/:id', function(req, res, next) {
   res.status(501).send("HTTP - GET: yksittäisen viestin haun toteutus puuttuu!")
});

/* DELETE poista yksittäinen viesti. */
router.delete('/:id', function(req, res, next) {
    db.deleteMessageById(req.params.id, function (data) {
		if(data)
    		res.status(201).send({message: "Viesti poistettu! Paina logo jatkaaksesti."});
		else
			res.status(403).send({error: "Viestin poistaminen epäonnistui! Paina logo jatkaaksesti."});
    });
});

/*PATCH päivitä yksittäisen viestin jokin kenttä. */
/*router.patch('/:id', function(req, res, next) {
    res.status(501).send("HTTP - PATCH: toteutus puuttuu!")
});

/* PUT päivitä yksittäinen viesti. */
/*router.put('/:id', (req, res) => {
    res.status(501).send("HTTP - PUT: toteutus puuttuu!")
});*/
////////////////////////////////////mine///////////////////////////////

/*router.get('/:id', function(req,res,next) {
  let id = req.params.id
  res.header('Cache-Control', 'no-cache, no-store, must-validate')
  db.findMessageById(req.params.id, function(theMessage){
    res.json(theMessage)
  })
});*/

router.get('/:id', function(req, res, next) {
    db.findMessageById(req.params.id, function (data) {

      for(var i=0; (i < data.length); i++) {
            if( data[i].id == req.params.id) {
            console.log(req.params.id + " here are params")
            res.json(data[i])
    }}
      res.status(403).send({error: "Viestin löytäminen epäonnistui! Paina logo jatkaaksesti."});
    });
});


//commented out to rest the pipeline speed*/
/*router.get('/:id/:message', function(req, res, next) {
    db.findMessageById(req.params.message, function (data) {

      for(var i=0; (i < data.length); i++) {
            if( data[i].id == req.params.id) {
            //console.log(req.params.id + " here are params")
        res.json(data[i].message)
        res.status(200)
        //console.log(data[i].message + " here is data")
    }}
      //res.status(403).send({error: "Viestin löytäminen epäonnistui! Paina logo jatkaaksesti."});
    });
});*/


router.patch('/:id', function(req, res, next) {
   // console.log(req.params.id);

  db.modifyMessages(req.params.id, req.body)
    .then(data => {
      response.success(req, res, data, 200);
    })
    .catch( e => {
      response.error(req, res, 'Internal Error', 500, e);
    });

});


/*router.patch("/:id/:message", function(request, response) {
  var id = request.params.id;
  
  var msg = request.body.message;

  request.db.get("messages").update({'message': msg}, function(error, document) {
    if (error) {
      console.log(error);
      res.status(403).send({error: "PATCH failed"});
    } 
    
    else {
      response.send('Updated'); }
      
  });
    
});*/


module.exports = router;
