var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

/* GET home page. */
router.get('/', authenticate.verifyUser,(req, res, next)=> {
  res.render('index', { title: 'Express' });
});

module.exports = router;
