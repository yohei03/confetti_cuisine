const mysql = require('mysql2/promise');
const ULID = require("ulid");
const SubscribersController = require('./subscribersController');

const conMysql = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database:'confetti_cuisine'
  });
}

module.exports = {
  index: async(req,res,next) => {
    try {
      const con = await conMysql();
      const [rows, fields] = await con.query("SELECT * FROM Users");
      res.locals.users = rows;
      next();
    } catch (e) {
      console.log(`Error fetching users: ${e.message}`)
      res.redirect("/");
    }
  },

  indexView: async (req,res) => {
    res.render("user/index");
  },

  new: (req,res) =>{
    res.render("users/new");
    },

  create: async(req,res,next) => {
    //userCreateのためのデータ型を作成してcreateのqueryを叩く
    user = {
      id: ULID.ulid(),
      name: JSON.stringify({
        first: req.body.first, 
        last: req.body.last
      }),
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    const con = await conMysql();
    try {
      //search subscriber who has the same email address
      try{
        if (user.subscribedAccount == undefined) {
          const [result, fields] = await con.execute("SELECT * FROM subscribers WHERE email = (?)",[user.email]);
          user.subscribedAccount = result
        }
      } catch (e) {
        console.log(e.message);
        throw e;
      }
      const result = await con.query('INSERT INTO users SET ?',user);
      res.locals.redirect = "/users";
      res.locals.user = user;
      next()
    } catch (e) {
      console.log(e)
      next(e)
    }
  },

  redirectView: async (req,res, next) => {
    let redirectPath = res.locals.redirect;
    if(redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async(req,res,next) => {
    let userId = req.params.id;
    try {
      const con = await conMysql()
      const [user, field] = await con.execute("SELECT * FROM users WHERE id = ?",[userId])
      const x = user[0].name
      user[0].fullName = user[0].name.first +" " + user[0].name.last;
      res.locals.user = user;
      next()
    } catch(e) {
      console.log(`Error fetching user by ID: ${e.message}`);
      next(e)
    }
  },

  showView: (req,res) => {
    res.render("users/show");
  }
}


