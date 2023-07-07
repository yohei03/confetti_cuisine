const ULID = require("ulid");
const mysqlMethod = require("./mysql");


module.exports = {
  index: async (req,res,next) => {
    try {
      const result = await mysqlMethod.findAll();
      req.locals.subscribers = result;
      next();
    } catch (e) {
      console.log(`Error fetching subscribers: ${e.message}`)
      next(e);
    } 
  },

  indexView: async (req,res) => {
    res.render("subscribers/index");
  },

  new: (req,res) => {
    res.render("subscribers/new");
  },

  create: async(req,res,next) => {
    //userCreateのためのデータ型を作成してcreateのqueryを叩く
    try {
      subscriber = {
        id: ULID.ulid(),
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
      };
      const result = await mysqlMethod.create("subscribers", subscriber)
      res.locals.redirect = "/subscribers";
      res.locals.subscriber = subscriber;
      next()
    } catch (e) {
      console.log(`Error saving subscriber: ${subscriber}`);
      next(e);
    }
  },

  redirectView: async (req,res, next) => {
    let redirectPath = res.locals.redirect;
    if(redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async(req,res,next) => {
    let subscriberId = req.params.id;
    try {
      const subscriber = await mysqlMethod.findOneById("subscribers",subscriberId)[0]
      res.locals.subscriber = subscriber;
      next()
    } catch(e) {
      console.log(`Error fetching subscriber by ID: ${e.message}`);
      next(e)
    }
  },

  showView: (req,res) => {
    res.render("subscribers/show");
  },

  edit: async (req,res,next) => {
    try{
      let subscriberId = req.params.id;
      const subscriber = await mysqlMethod.findOneById("subscribers",subscriberId);
      await res.render("subscribers/edit", {
        subscriber: subscriber[0]
      });
    } catch (e) {
      console.log(`Error fetching subscriber by ID: ${e.message}`);
      next(e);
    }
  },

  update: async(req,res,next) => {
    try {
      const subscriberId = req.params.id;
      userParams = {
//        id: ULID.ulid(),
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
      };
      const user = await mysqlMethod.findByIdAndUpdate("subscribers",id,userParams)
      res.locals.redirect =`/subscribers/${subscriberId}`;
      res.locals.user = user;
      next();
    } catch (e){
      console.log(`Error updating subscribers by ID: ${e.message}`);
      next(e);
    } 
  },

  delete: async(req,res,next) => {
    try {
      let subscriberId = req.params.id;
      const result = await mysqlMethod.findByIdAndRemove("subscribers", subscriberId);
      res.locals.redirect = "/subscribers";
      next();
    } catch (e) {
      console.log(`Error deleting subscriber by ID: ${e.message}`);
      next(e);
    }
  } 
}






