var express = require('express');
var router = express.Router();
const session = require('express-session');
const mysql = require('mysql');

//create new account
router.get("/new", function(req, res) {
    res.render('finalProject/create_account');
});

// Home Page...
router.get('/', function(req, res) {
    
    console.log("Home being generated");
    
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
    
router.post('/', function(req, res) {

    console.log('inside login post');

    let successful = false;
    let message = '';
    
    // TODO: replace with MySQL SELECT and hashing/salting...
    if (req.body.username === 'hello' && req.body.password === 'world') {
        successful = true;
        req.session.username = req.body.username;
    }
    else {
        // delete the user as punishment!
        delete req.session.username;
        message = 'Wrong username or password!'
    }

    console.log('session username', req.session.username);

    // Return success or failure
    res.json({
        successful: successful,
        message: message
    });

});

router.get('/admin', function(req, res) {
    
    if (req.session && req.session.username && req.session.username.length) {
        res.render('finalProject/admin', {
            title: 'Admin',
            username: req.session.username
        });
    }
    else {
        delete req.session.username;
        res.redirect('/finalProject/');
    }
    
});

router.post('/create_account', function(req, res) {

    console.log('inside create_account post');

    const connection = mysql.createConnection({
        host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'u4iixpff4n2b1uam',
        password: 'gszyw5nfp2os51lq',
        database: 'c2cyppf6xaxjv2wy'
    });

    connection.connect();
    
    connection.query(
        'INSERT INTO users(username, hash, firstName, lastName, age) VALUES (?, ?, ?, ?, ?)', [req.body.username, req.body.password, req.body.fname, req.body.lname, req.body.age],
        (error, results, fields) => {
            if (error) throw error;
            res.json({
                successful: true,
                message: "account created"
            });
        });
    
    connection.end();
});


router.get('/logout', function(req, res) {
    if (req.session && req.session.username && req.session.username.length) {
        delete req.session.username;
    }

    res.json({
        successful: true,
        message: ''
    });
});

module.exports = router;