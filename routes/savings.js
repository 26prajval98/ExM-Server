var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var savings = require('../models/savings');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var isSameWeek = (preDate, currentDate)=>{
    dayOfWeek = {}
    dayOfWeek['min'] = preDate.getDay();
    dayOfWeek['max'] = currentDate.getDay();
    if( currentDate - preDate > 518400000 || dayOfWeek['min'] > dayOfWeek['max']) {
        return false;
    }
    return true;
}

function calculateWeeksBetween(date1, date2) {
    var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = Math.abs(date1_ms - date2_ms);
    return 1+Math.floor(difference_ms / ONE_WEEK);
}


router.get('/', authenticate.verifyUser, (req,res,next)=>{
    savings.findOne({uid: req.user._id})
    .then((saving)=>{
        console.log(saving);
        res.json({details : saving});
    })
    .catch((err)=>{
        next(err);
    })
})

router.post('/', authenticate.verifyUser, (req,res,next)=>{
    savings.findOne({uid: req.user._id})
    .then((saving)=>{
        if(!saving){
            return savings.create({
                savingsList : [{weekNo: 1, saved: req.body.saved}],
                uid : req.user._id
            })
        }
        else{
            var lenList = saving.savingsList.length;
            var last = saving.savingsList[lenList-1];
            console.log(last.createdAt);
            if(isSameWeek(last.createdAt, new Date())){
                saving.savingsList[lenList-1].saved = req.body.saved;
            }
            else{
                saving.savingsList.push({weekNo: last.weekNo+calculateWeeksBetween(last.createdAt, new Date()), saved: req.body.saved});
                saving.savings = saving.savings +  last.saved;
            }
            return saving.save();
        }
    })
    .then((to)=>{
        res.json({Success:true});
    })
    .catch(err=>{
        console.log(err);
    }) 
});


router.post('/bought', authenticate.verifyUser, (req,res,next)=>{
    savings.findOne({uid: req.user._id})
    .then((saving)=>{
        saving.boughtFromSavings += req.body.bought;
        saving.savings -= req.body.bought;
        return saving.save();    
    })
    .then((to)=>{
        res.json({Success:true});
    })
    .catch(err=>{
        console.log(err);
    }) 
})

module.exports = router;