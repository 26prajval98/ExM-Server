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

module.exports = router;