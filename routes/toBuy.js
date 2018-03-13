var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var toBuy = require('../models/toBuy');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', authenticate.verifyUser, (req,res,next)=>{
    toBuy.findOne({uid:req.user._id})
    .then(toBuyList=>{
        List = toBuyList.toBuy;
        res.json({List:List});
    })
    .catch(err=>{
        next(err);
    })
});

router.post('/', authenticate.verifyUser, (req,res,next)=>{
    toBuy.findOne({uid: req.user._id})
    .then((toBuyList)=>{
        if(!toBuyList){
            return toBuy.create({
                toBuy : [{item: req.body.item, price: req.body.price}],
                uid : req.user._id
            })
        }
        else{
            toBuyList.toBuy.push({item: req.body.item, price: req.body.price});
           return toBuyList.save();
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

router.post('/delete', authenticate.verifyUser, (req,res,next)=>{
    toBuy.findOne({uid:req.user._id})
    .then((toBuyList)=>{
        toBuyList.toBuy.id(req.body.id).remove();
        toBuyList.save();
    })
    .then(()=>{
        res.json({Success:true});
    })
    .catch((err)=>{
        next(err);
    })
});

router.post('/update', authenticate.verifyUser, (req,res,next)=>{
    toBuy.findOne({uid:req.user._id})
    .then((toBuyList)=>{
        toBuyList.toBuy.id(req.body.id).purchased = true;
        return toBuyList.save();
    })
    .then(()=>{
        res.json({Success:true});
    })
});


module.exports = router;