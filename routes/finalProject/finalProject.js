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
    
    // EXAMPLE LINK - /bracketing?username=kevin1&title=GTX%2012
    
    // MYSQL CALL
    
    // -
    // -  -  _
    // -  -
    // -
    
    var fake_data = [
        {
        "level": 3,
        "position": 1,
        "display_name_1": "kevin",
        "display_name_2": "jacob",
        "won": "NULL"
        },
        {
        "level": 3,
        "position": 2,
        "display_name_1": "cat",
        "display_name_2": "dog",
        "won": "NULL"
        },
        {
        "level": 3,
        "position": 3,
        "display_name_1": "eagle",
        "display_name_2": "hawk",
        "won": "NULL"
        },
        {
        "level": 3,
        "position": 4,
        "display_name_1": "mario",
        "display_name_2": "sonic",
        "won": "NULL"
        }];
        
    res.render('finalProject/bracketing', {
       title: 'Tournament Brackets',
       game: '?',
       data: JSON.stringify(fake_data)
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

module.exports = router;