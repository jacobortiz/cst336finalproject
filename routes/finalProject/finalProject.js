var express = require('express');
var router = express.Router();
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
        message = 'Wrong username or password!';
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

    // bcrypt.hash(req.body.password, 8, function(err, hash) {
    //     console.log("Hash: " + hash);

    //     // imagine mysql grab right here

    //     bcrypt.compare('somePassword', hash, function(err, res) {
    //         if(res) {
    //             console.log("PASSWORD MATCHES!");
    //         } else {
    //             console.log("PASSWORD DOESNT MATCH");
    //         } 
    //       });
    // });

    bcrypt.hash(req.body.password, 8, function(err, hash) {

        date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const connection = mysql.createConnection({
            host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'u4iixpff4n2b1uam',
            password: 'gszyw5nfp2os51lq',
            database: 'c2cyppf6xaxjv2wy'
        });
    
        connection.connect();
        
        connection.query(
            'INSERT INTO user(username, hash, firstName, lastName, age, created) VALUES (?, ?, ?, ?, ?, ?)', [req.body.username, hash, req.body.fname, req.body.lname, req.body.age, date],
            (error, results, fields) => {
                if (error) throw error;
                res.json({
                    successful: true,
                    message: "account created"
                });
            });
        
        connection.end();
    });
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

router.post('/create_tournament', function(req, res) {

    username = "kevin1";

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
        'INSERT INTO tournament(username, title, levels, created , zip) VALUES (?, ?, ?, ?, ?);', 
        [username, req.body.title, req.body.levels, date, req.body.zip], 
        (error, results, fields) => {
            if (error) {
                res.json({
                    successful: false,
                    message: 'could not insert into tournament table!'
                });
            }

            console.log("Tournament Created!");

            console.log(req.body.matches);
            connection.query(
                ''
            );
        }
    );

    
    
    connection.end();

});

module.exports = router;