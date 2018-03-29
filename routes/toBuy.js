var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var toBuy = require('../models/toBuy');
var passport = require('passport');
var authenticate = require('../authenticate');
var mailer = require('node-mailer');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'donotreplyexm@gmail.com',
    pass: 'exm12345'
  }
});

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

var obj;

router.post('/update', authenticate.verifyUser, (req,res,next)=>{
    toBuy.findOne({uid:req.user._id})
    .then((toBuyList)=>{
        toBuyList.toBuy.id(req.body.id).purchased = true;
        obj = toBuyList.toBuy.id(req.body.id);
        return toBuyList.save();
    })
    .then(()=>{
        var mailOptions = {
            from: 'donotreplyexm@gmail.com',
            to: req.user.username,
            subject: 'Your Purchase',
            html:`
            <div style="width:100%;max-width:800px;position:absolute;">
                <div style="margin:auto;position:relative;">
                    <h1>Congratulations On Purchase</h1>
                    <p>
                        You have purchased ${obj.item} for INR
                         ${obj.price} on ${new Date()}
                    </p>
                </div>
            </div>           
            `
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
        res.json({Success:true});
    })
});


module.exports = router;