const mysql = require('mysql2/promise');
const mysqlMethod = require('./mysql');
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
      const rows = await mysqlMethod.findAll("users");
      res.locals.users = rows;
      next();
    } catch (e) {
      console.log(`Error fetching users: ${e.message}`)
      res.redirect("/");
    }
  },

  indexView: async (req,res) => {
    res.render("users/index");
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
          const result = await mysqlMethod.findOneByEmail("subscribers",user.email)
          user.subscribedAccount = result
        }
      } catch (e) {
        console.log(e.message);
        throw e;
      }
      const result = await mysqlMethod.create("users", user)
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
      const user = await mysqlMethod.findOneById("users",userId)[0]
      user.fullName = user.name.first +" " + user.name.last;
      res.locals.user = user;
      next()
    } catch(e) {
      console.log(`Error fetching user by ID: ${e.message}`);
      next(e)
    }
  },

  showView: (req,res) => {
    res.render("users/show");
  },

  edit: async (req,res,next) => {
    try{
      let userId = req.params.id;
      const user = await mysqlMethod.findOneById("users",userId);
      await res.render("users/edit", {
        user: user[0]
      });
    } catch (e) {
      console.log(`Error fetching user by ID: ${e.message}`);
      next(e);
    }
  },

  update: async(req,res,next) => {
    try {
      const userId = req.params.id;
      userParams = {
        id: ULID.ulid(),
        name: JSON.stringify({
          first: req.body.first, 
          last: req.body.last
        }),
        email: req.body.email,
        password: req.body.password,
        zipCode: req.body.zipCode
      };
      const user = await mysqlMethod.findByIdAndUpdate("users",id,userParams)
      res.locals.redirect =`/users/${userId}`;
      res.locals.user = user;
      next();
    } catch (e){
      console.log(`Error updating user by ID: ${e.message}`);
      next(e);
    } 
  },

  delete: async(req,res,next) => {
    try {
      let userId = req.params.id;
      const result = await mysqlMethod.findByIdAndRemove("users",userId);
      res.locals.redirect = "/users";
      next();
    } catch (e) {
      console.log(`Error deleting user by ID: ${e.message}`);
      next(e);
    }
  } 
}
