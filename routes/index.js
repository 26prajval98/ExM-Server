var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');
var path = require('path');

/* GET home page. */
router.get('/',(req, res, next)=> {
    res.sendFile(path.join(__dirname, '../','index.html'));
});

module.exports = router;