var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

/* GET home page. */
router.get('/', authenticate.verifyUser,(req, res, next)=> {
  var obj = {
    ratings : req.body.ratings,
    review  : req.body.review,
    uid     : req.user._id
  }
  
});

module.exports = router;
