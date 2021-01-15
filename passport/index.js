const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user.model');

const userService = require('../models/user.model');

passport.use(new LocalStrategy(
    function (username, password, done) {
        userService.checkCredential(username, password).then((user) =>{
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
            return done(null, user);
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    userModel.getUser(id).then((user) => {
        delete user.password_hash;
        done(null, user);
    });
});


module.exports = passport;