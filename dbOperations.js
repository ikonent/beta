var mariadb = require('mariadb/callback');
var bcrypt = require('bcrypt');
var hostname = "maria.westeurope.cloudapp.azure.com";
var msgDb = 'LTD7008';
var dbUser = "opiskelija";
var dbPasswd = "opiskelija1";

module.exports = {

    // Viestien haku tietokannasta
    findMessages : function(id2Topic,suunt, callback) {
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });
        let suunta =(suunt)?"ASC":"DESC";

        console.log(typeof(suunt)+" "+suunta);
        con.connect(err => {
            if (err) return callback(null);

            con.query("SELECT a.* FROM messages a WHERE a.topic LIKE (SELECT b.topic FROM messages b WHERE "+id2Topic+"=b.id ) ORDER BY a.id "+suunta, (err, data) => {
                if(err) return callback(null);
                con.close();
                return callback(data);
            });
        });
    },
    /*

    Tämä on jemma, jos menee pieleen
    findMessages : function(suunt, callback) {
        var con = mariadb.createConnection({
             host: hostname,
             user: dbUser,
             password: dbPasswd,
             database: msgDb
        });
        let suunta =(suunt)?"ASC":"DESC";

        console.log(typeof(suunt)+" "+suunta);
        con.connect(err => {
            if (err) return callback(null);

            con.query("SELECT * FROM messages ORDER BY id "+suunta, (err, data) => {
                if(err) return callback(null);
                con.close();
				return callback(data);
            });
        });
    },

    // Otsikoiden haku tietokannasta
    findTitles : function(suunt, callback) {
        var con = mariadb.createConnection({
             host: hostname,
             user: dbUser,
             password: dbPasswd,
             database: msgDb
        });
        let suunta =(suunt)?"ASC":"DESC";

        //console.log(typeof(suunt)+" "+suunta);
        con.connect(err => {
            if (err) return callback(null);

            con.query("SELECT MAX(a.id) AS uusin, a.topic, COUNT(a.id) AS lukum, b.sender FROM messages a LEFT JOIN messages b WHERE uusin=b.id GROUP BY topic ORDER BY uusin "+suunta, (err, data) => {
                if(err) return callback(null);
                con.close();
				return callback(data);
            });
        });
    },

    */

    // Otsikoiden haku tietokannasta
    findTitles : function(suunt, callback) {
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });
        let suunta =(suunt)?"ASC":"DESC";

        //console.log(typeof(suunt)+" "+suunta);
        con.connect(err => {
            if (err) return callback(null);
            // Poimitaan otsikot, viestien määrä sekä uusimman viestin id ja lähettäjä
            con.query("SELECT uusin, a.topic, lukum, a.sender FROM messages a JOIN (SELECT MAX(id) AS uusin, topic, COUNT(*) AS lukum FROM messages GROUP BY topic) b ON a.id=b.uusin  ORDER BY uusin "+suunta, (err, data) => {
                if(err) return callback(null);
                con.close();
                return callback(data);
            });
        });
    },
    // Tietyn ostikon haku tietokannasta
    findTopic : function(iidee, callback) {
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });

        //console.log(typeof(suunt)+" "+suunta);
        con.connect(err => {
            if (err) return callback(null);
            // Poimitaan otsikot, viestien määrä sekä uusimman viestin id ja lähettäjä
            con.query("SELECT topic FROM messages WHERE id="+iidee, (err, data) => {
                if(err) return callback(null);
                con.close();
                console.log("etsi otsikko "+data);
                return callback(data);
            });
        });
    },

    findSingleMsg : function(iidee, callback) {
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });
        con.connect(err => {
            if (err) return callback(null);

            con.query("SELECT * FROM messages WHERE id="+iidee, (err, data) => {
                if(err) return callback(null);
                con.close();
                return callback(data);
            });
        });
    },

    createMessage : function (req, callback ) {
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });

        con.connect(err => {
            if (err) {
                return callback(false);
            } else {
                con.query("INSERT INTO messages (sender, topic, message) values( ?, ?, ?)", [req.sender, req.topic, req.message], (err, result) => {
                    if (err) return callback(false);
                    con.query("COMMIT", (err, ans) => {;
                                                       con.query("SELECT * FROM messages", (err, data) => {
                                                           if (err) return callback(false);
                                                           con.close();
                                                           return callback(true);
                                                       });
                                                      });
                });
            };
        });
    },

    editMessage : function (req, callback ) {
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });

        con.connect(err => {
            if (err) {
                return callback(false);
            } else {
                con.query("UPDATE messages SET message='"+req.message+"' WHERE id="+req.muokkaa, (err, result) => {
                    if (err) return callback(false);
                    con.query("COMMIT", (err, ans) => {;
                                                       con.query("SELECT * FROM messages", (err, data) => {
                                                           if (err) return callback(false);
                                                           con.close();
                                                           return callback(true);
                                                       });
                                                      });
                });
            };
        });
    },

    deleteMessage : function (delid, callback ) {
        const con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb,
        });
        // Poisto
        con.connect(err => {
            if (err) return callback(null);
            // Poimitaan otsikot, viestien määrä sekä uusimman viestin id ja lähettäjä
            con.query("DELETE FROM messages WHERE id="+delid, (err, data) => {
                if(err) return callback(null);
                con.query("COMMIT", (err, ans) => {;
                                                   con.query("SELECT * FROM messages", (err, data) => {
                                                       if (err) return callback(false);
                                                       con.close();
                                                       return callback(true);
                                                   });
                                                  });
            });

        });
    },


    verifyUserId: function (req, callback) {
        // otetaan yhteys Maria-tietokantaan
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });
        con.connect(err => {
            if (err) return callback("Access denied");
            con.query("SELECT * FROM users where (username) = (?)", [req.body.userid], (err, result) => {
                if (err) return callback(err);;
                if( result.length == 0 ) 
                    result = "not exist";
                else
                    if(bcrypt.compareSync(req.body.passwd, result[0].password))
                        result = "exist";
                else 
                    result = "not valid";
                con.end();
                return callback(result);
                
            });
        });
    },

    registerUser: function (req, callback) {
        // otetaan yhteys Maria-tietokantaan
        var con = mariadb.createConnection({
            host: hostname,
            user: dbUser,
            password: dbPasswd,
            database: msgDb
        });
        con.connect(err => {
            if (err) {
                result = "Access denied"; 
                callback(result);
            } else {
                con.query("SELECT * FROM users where username = (?)", [req.body.userid], (err, result) => {
                    if (err) throw err;
                    var hash = bcrypt.hashSync( req.body.passwd, 10); 
                    if( result.length == 0 ) {
                        con.query("INSERT INTO users (username, password) values (?, ?)", [req.body.userid, hash], (err, result) => {
                            if (err) throw err;
                            result = "Username " + req.body.userid + " registered";
                            con.query('COMMIT');
                            con.end();
                            return callback(result);
                        });
                    }
                    else {
                        result = "Username already exists"; 
                        con.end();
                        return callback(result);
                    }
                });
            };
        });
    }
}