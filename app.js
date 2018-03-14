var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var passport = require('passport');
var authenticate = require('./authenticate');

var config = require('./config');
var index = require('./routes/index');
var users = require('./routes/users');
var review = require('./routes/review');
var images = require('./routes/images');
var toDo = require('./routes/toDo');
var toBuy = require('./routes/toBuy');
var exp = require('./routes/exp');
var savings = require('./routes/savings');

mongoose.connect(config.uri)
.then((db)=>{
  console.log('Connected Successfully');
})
.catch((err)=>{
  next(err);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);
app.use('/review', review);
app.use('/images', images);
app.use('/toDo', toDo);
app.use('/toBuy', toBuy);
app.use('/exp', exp);
app.use('/savings', savings);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
