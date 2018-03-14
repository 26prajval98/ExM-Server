var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var exp = require('../models/exp');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', authenticate.verifyUser, (req,res,next)=>{
    exp.findOne({uid:req.user._id})
    .then((expList)=>{
        res.json({expList:expList.expList});
    })
    .catch(err=>{
        next(err);
    })
});

router.post('/', authenticate.verifyUser, (req,res,next)=>{
    exp.findOne({uid: req.user._id})
    .then((exp)=>{
        if(!exp){
            return exp.create({
                expList : [{item: req.body.item, price: req.body.price, purchasedOn : req.body.price, latitude: req.body.latitude, longitude: req.body.longitude}],
                uid : req.user._id
            })
        }
        else{
            exp.expList.push({item: req.body.item, price: req.body.price, purchasedOn : req.body.price, latitude: req.body.latitude, longitude: req.body.longitude});
            return exp.save();
        }
    })
    .then((to)=>{
        console.log(to);
        res.json({Success:true});
    })
    .catch(err=>{
        console.log(err);
    })
    
});


module.exports = router;