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
    console.log(obj);
    Review.create(obj)
    .then((review)=>{
        console.log('ajsdadas');
        console.log(review);
        res.setHeader('Content-type', 'application/json');
        res.json({err:false});
    })
    .catch((err)=>{
        res.setHeader('Content-type', 'application/json');
        res.json({err:true});
    })
});

module.exports = router;