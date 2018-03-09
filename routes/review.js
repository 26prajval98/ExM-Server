var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Review = require('../models/review');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', authenticate.verifyUser,(req, res, next)=> {
    var obj = {
      ratings : req.body.ratings,
      review  : req.body.review,
      uid     : req.user._id
    }
    Review.create(obj)
    .then((review)=>{
        res.setHeader('Content-Type','application/json');
        res.json({err:false});
    })
    .catch(err=>{
        err = new Error('Failed');
        res.setHeader('Content-Type','application/json');
        res.json({err:true});
        next(err);
    })
});

module.exports = router;