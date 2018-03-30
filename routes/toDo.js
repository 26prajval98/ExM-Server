var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var toDo = require('../models/toDo');
var passport = require('passport');
var authenticate = require('../authenticate');
var mailer = require('node-mailer');
var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'donotreplyexm@gmail.com',
    pass: 'exm12345'
  }
});


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

        var mailOptions = {
            from: 'donotreplyexm@gmail.com',
            to: req.user.username,
            subject: 'Reminder',
            html:`
                <div style="width:100%;max-width:800px;position:absolute;">
                    <div style="margin:auto;position:relative;">
                        <h4 style="text-align:center;">REMINDER!!</h4>
                        <h1 style="text-align:center;color:blue">Your work ${item.item} is pending.<h1>
                    </div>
                </div>           
            `
        };
                
        console.log(req.body.date);

        if(new Date(req.body.date) >= new Date()){
            console.log("ahdabs");
            var job = new CronJob(new Date(req.body.date), function() {
                    console.log('immediately started');
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                    });
                },
                null,
                true, 'America/Los_Angeles'
            );
        }
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