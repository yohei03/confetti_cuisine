const LocalStrategy = require('passport-local');
const mysqlClient = require("../database/mysql");
const bcrypt = require("bcrypt");
const e = require('connect-flash');

module.exports =async function (passport) {

  console.log('calling')

  await passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField: "password"
  },async function(email, password, done) {
    let user
    try{
       user = (await mysqlClient.findOneByEmail("users", email))[0];
    } catch (e) {
      console.log(e)
      throw e
    }
    if(user.length === 0) {
      console.log("error email is incorrect")
      return done(null, false, {message: "Invalid User"});
    } 
    try{
      const isMatched = await bcrypt.compare(password, user.password);
      if (isMatched) {
        console.log("success")
        return done(null, user);
      } else {
        console.log("error")
        return done(null, false, {message: "Invalid User"});
      }
    } catch (e) {
      console.log(e);
      throw e;
    }

  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })
  
  
  passport.deserializeUser(async function(id, done) {
    try {
      const user = (await mysqlClient.findOneById("users",id))[0];
      done(null,user);
    } catch (error) {
      done(error,null);
    }
  });
}
