var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var toDo = require('../models/toDo');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, (req,res,next)=>{
    toDo.find({uid : req.user._id})
    .then((items)=>{
        res.json({items: items});
    })    
    .catch(err=>{
        next(err);
    })
})
router.post('/', authenticate.verifyUser, (req,res,next)=>{
    toDo.create({
        item : req.body.item,
        uid : req.user._id
    })
    .then((item)=>{
        console.log(item);
        res.json({successful: true});
    })    
    .catch(err=>{
        next(err);
    })
});
router.post('/delete', authenticate.verifyUser, (req,res,next)=>{
    toDo.findOneAndRemove({_id:req.body.id})
    .then(()=>{
        res.setHeader('Content-Type','application/json');
        res.json({successful:true});
    })
});

module.exports = router;