var express = require('express');
var router = express.Router();

// Home Page...
router.get('/', function(req, res) {
        
    res.render('finalProject/home', {
        title: 'CST 336',
    });
    
});

module.exports = router;