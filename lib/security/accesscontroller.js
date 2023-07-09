const passport = require('passport');
const LocalStrategy = require('passport-local');
const mysqlClient = require("../database/mysql");



passport = function (passport) {
  passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField: "password"
  },function(email, password, done) {
    const user = mysqlClient.findOneByEmail("users", email);
    const isMatched = bcrypt.compare(password, user.password);
    if(user.length === 0) {
      return done(null, false, {message: "Invalid User"});
    } else if (isMatched) {
      return done(null, user);
    } else {
      return done(null, false, {message: "Invalid User"});
    }
  }));
  
  
  passport.serializeUser(function(user, done) {
    done(null, user[0].id);
  })
  
  
  passport.deserializeUser(function(id, done) {
    mysqlClient.findOneById(id, function(err, user) {
      done(err, user);
    });
  });
}

module.exports = passport
