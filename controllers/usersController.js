const mysql = require('mysql2/promise');
const ULID = require("ulid");

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
    console.log(req.body)
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
    try {
      const con = await conMysql();
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
      //そのIDをもつuserを探す
    } catch(e) {
      console.log(`Error fetching user by ID: ${e.message}`);
      next(e)
    }
  },

  showView: (req,res) => {
    res.render("users/show");
  }
}


