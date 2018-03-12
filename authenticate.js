var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/users');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

exports.getToken = (user)=>{
    return jwt.sign(user, config.secretKey,{expiresIn: 24*60*60});     
}

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JWTStrategy(opts,
    (jwt_payload, done) => {
        //console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
