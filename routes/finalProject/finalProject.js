var express = require('express');
var router = express.Router();
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

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

    
router.post('/login', function(req, res) {
    
    const connection = mysql.createConnection({
        host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'u4iixpff4n2b1uam',
        password: 'gszyw5nfp2os51lq',
        database: 'c2cyppf6xaxjv2wy'
    });
    
    connection.connect();
    
    let SQLCommand_checkUserExists = `SELECT u.hash
                                      FROM user u 
                                      WHERE u.username LIKE '${req.body.username}'`;
    

    connection.query(SQLCommand_checkUserExists, (error, results, fields) => {
        if (error) throw error;
        if (results.length == 0) {
             res.json({
                successful: false,
                message: "incorrect username"
            });
            return;
        }
        
        let actual_pswd = results[0].hash;
        let typed_pswd = req.body.password;
        
        bcrypt.compare(typed_pswd, actual_pswd, function(error, result) {
                if (error) throw error;
                
                console.log("RES", result);
                if(result) {
                    req.session.username = req.body.username;
                    res.json({
                        successful: true,
                        message: ""
                    });
                
                } else {
                    delete req.session.username;
                    res.json({
                        successful: false,
                        message: "incorrect password"
                    });
                
                } 
        });
    });     
    connection.end();
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
    
    const connection = mysql.createConnection({
        host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'u4iixpff4n2b1uam',
        password: 'gszyw5nfp2os51lq',
        database: 'c2cyppf6xaxjv2wy'
    });
    
    connection.connect();
    
    let SQLCommand_checkUserExists = `SELECT u.username
                                      FROM user u 
                                      WHERE u.username LIKE '${req.body.username}'`;
    

    connection.query(SQLCommand_checkUserExists, (error, results, fields) => {
        if (error) throw error;
     
        if (results.length != 0) {
             res.json({
                successful: false,
                message: "username taken"
            });
            return;
        }
        
        console.log("MAde it??");
        let SQLCommand_addNewUser = `INSERT INTO user(username, hash, firstName, lastName, age, created) VALUES (?, ?, ?, ?, ?, ?)`;
    
        let uname = req.body.username;
        let pswd = req.body.password;
        let fname = req.body.fname;
        let lname = req.body.lname;
        let age = req.body.age;
        let created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        bcrypt.hash(pswd, 8, function(err, hash) {
            if (err) throw err;
            connection.query(SQLCommand_addNewUser, [uname, hash, fname, lname, age, created], (error, results, fields) => {
                if (error) throw error;
                
                res.json({
                    successful: true,
                    message: "account created"
                });
                
                connection.end();
                return;
            });
    });
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