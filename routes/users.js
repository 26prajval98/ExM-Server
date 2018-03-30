var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/',authenticate.verifyUser, function(req, res, next) {
  res.setHeader('Content-type', 'application/json');
  res.json({username:req.user.username, about:req.user.about});
}); 

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({token: token});
  }
});

router.post('/signup',(req,res,next)=>{
  console.log(req.body.username);
  User.register(new User({username:req.body.username}), req.body.password, (err)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-type', 'application/json');
      res.json({Status: 'Registration Failed', err: err});
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-type', 'application/json');
      res.json({Status: 'Registration Successful'});
      passport.authenticate('local');
    }
  })
})

router.post('/login', passport.authenticate('local'), (req,res)=>{
  var token = authenticate.getToken({_id: req.user._id});
  res.setHeader('Content-type', 'application/json');
  res.statusCode = 200;
  console.log('Sending Back');
  res.json({status:true,token: token});
})

router.get('/logout',(req,res,next)=>{
  res.redirect('/users');
})

router.post('/update', authenticate.verifyUser, (req,res)=>{
    User.findOneAndUpdate({_id:req.user._id}, { $set: { about: req.body.about}})
    .then((user)=>{
      res.setHeader('Content-Type','application/json');
      res.json({success: true, user : user});
    })
})

router.get('/admin', (req,res,next)=>{
  User.find({})
  .then(userArray=>{
    res.json({userArray: userArray});
  })
})

router.post('/admin', (req,res,next)=>{
  console.log(req.body.id);
  User.findOneAndRemove({_id:req.body.id})
  .then(()=>{
    res.json({success:true});
  })
})

module.exports = router;