var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

/* GET home page. */
router.get('/',(req, res, next)=> {
    res.sendFile('../index.html');
});

module.exports = router;