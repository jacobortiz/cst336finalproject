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
    res.render('finalProject/create_tournament');
});

// Home Page...
router.get('/', function(req, res) {
    res.render('finalProject/home', {
        title: 'CST 336',
    });
});

// bracketing
router.get('/bracketing', function(req, res) {
    
    // EXAMPLE LINK - /bracketing?title=GTX%2012

    var title = req.query.title;
    
    const sql = `SELECT level, position, won, display_name_1, display_name_2 
    from bracket where title="${title}" ORDER BY level DESC, position ASC;`;

    
    const connection = mysql.createConnection({
        host:       'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user:       'u4iixpff4n2b1uam',
        password:   'gszyw5nfp2os51lq',
        database:   'c2cyppf6xaxjv2wy'
    });
    
    connection.connect();
        
    connection.query(sql, (error, results, fields) => {
        if(error) throw error;
        
        res.render('finalProject/bracketing', {
           title: title,
           game: title,
           data: JSON.stringify(results)
        }); 
        
    });
    
    connection.end();
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

        const connection = mysql.createConnection({
            host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'u4iixpff4n2b1uam',
            password: 'gszyw5nfp2os51lq',
            database: 'c2cyppf6xaxjv2wy'
        });
        
        connection.connect();

        let query = `SELECT title, levels, zip, created FROM tournament WHERE username="${req.session.username}";`;
        
        connection.query(query, (error, results, fields) => {
            if (error) throw error;

            console.log(results);

            for (result of results) {
                result["levels"] = Math.pow(2, result["levels"])
            }

            res.render('finalProject/admin', {
                title: 'Admin',
                username: req.session.username,
                empty: results.length == 0,
                tournaments: results
            });
        });
        
        connection.end();
    } else {
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

router.post('/find_tournament', function(req, res){
     const connection = mysql.createConnection({
        host: 'ui0tj7jn8pyv9lp6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'u4iixpff4n2b1uam',
        password: 'gszyw5nfp2os51lq',
        database: 'c2cyppf6xaxjv2wy'
    });
    
    connection.connect();
    
    let keyword = req.body.keyword;
    let searchBy = req.body.searchBy;
    
    var SQLCommand;
    
    switch(searchBy) {
        case "title":
            SQLCommand = `SELECT t.*, CONCAT(u.firstName, ' ', u.lastName) AS fullName 
                          FROM user u RIGHT OUTER JOIN
                          tournament t ON t.username = u.username
                          WHERE t.title LIKE '%${keyword}%'`;
            break;
            
        case "username":
            SQLCommand = `SELECT t.*, CONCAT(u.firstName, ' ', u.lastName) AS fullName 
                          FROM tournament t INNER JOIN
                          user u ON t.username = u.username
                          WHERE t.username LIKE '%${keyword}%'`;
            break;
            
        case "zip":
            SQLCommand = `SELECT t.*, CONCAT(u.firstName, ' ', u.lastName) AS fullName 
                          FROM tournament t INNER JOIN
                          user u ON t.username = u.username
                          WHERE t.zip LIKE '%${keyword}%'`;
            break;
        default:
            break;
    }
   
    connection.query(SQLCommand, (error, results, fields) => {
        if (error) throw error;
    
        res.json({
            tournament: results
        });
    });   
    
    
    connection.end();
});

router.post('/create_tournament', function(req, res) {

    username = req.session.username;

    console.log(username);

    if (username == undefined) {
        console.log("NOT SIGNED IN!");
        res.json({
            successful: false,
            message: 'Invalid Credentials!'
        });
        return;
    }

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
                    message: 'Error: Title already exists!'
                });
                return;
            }

            console.log("Tournament Inserted into database!");

            console.log(req.body.matches);
            let c = 1;
            for (match of req.body.matches) {
                
                connection.query(
                    'INSERT INTO bracket(title, level, position, display_name_1, display_name_2, created) VALUES (?, ?, ?, ?, ?, ?)',
                    [req.body.title, req.body.levels, c, match[0], match[1], date],
                    (error, results, fields) => {
                        if (error) {
                            res.json({
                                successful: false,
                                message: 'Error: Contact Kevin!'
                            });
                            return;
                        }

                        if (c == req.body.matches.length) {
                            res.json({
                                successful: true,
                                message: 'success'
                            });
                            connection.end();
                            return;
                        }

                    }
                );

                c += 1;
            }
        }
    );
    connection.end();
});

module.exports = router;