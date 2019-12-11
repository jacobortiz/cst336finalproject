var express = require('express');
var router = express.Router();
<<<<<<< HEAD
=======
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

//create new account
router.get("/new", function(req, res) {
    res.render('finalProject/create_account');
});

router.get("/create_tournament", function(req, res) {

    console.log("Session Info > '" + req.session.username + "'");

    res.render('finalProject/create_tournament')
});
>>>>>>> 0d47d7af993d30bad27186fcd7bb252632d62694

// Home Page...
router.get('/', function(req, res) {
        
    res.render('finalProject/home', {
        title: 'CST 336',
    });
    
});

// bracketing
router.get('/bracketing', function(req, res) {
    
    res.render('finalProject/bracketing', {
       title: 'Tournament Brackets',
       game: '?',
    }); 
});


router.post('/create_tournament', function(req, res) {

    const connection = mysql.createConnection({
        host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'u4iixpff4n2b1uam',
        password: 'gszyw5nfp2os51lq',
        database: 'c2cyppf6xaxjv2wy'
    });

    connection.connect();

    let successful = false;
    let message = '';

    date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    connection.query(
        'INSERT INTO tournament(username, hash, firstName, lastName, age, created) VALUES (?, ?, ?, ?, ?, ?)', 
        [req.body.username, hash, req.body.fname, req.body.lname, req.body.age, date], 
        (error, results, fields) => {
            if (error) throw error;
        }
    );

    connection.query(
        'INSERT INTO user(username, hash, firstName, lastName, age, created) VALUES (?, ?, ?, ?, ?, ?)', 
        [req.body.username, hash, req.body.fname, req.body.lname, req.body.age, date], 
        (error, results, fields) => {
            if (error) throw error;
        }
    );
    
    connection.end();

});

module.exports = router;