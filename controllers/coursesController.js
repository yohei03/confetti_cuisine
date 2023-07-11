const ULID = require("ulid");
const mysqlMethod = require("../lib/database/mysql");


module.exports = {
  index: async (req,res,next) => {
    try {
      const result = await mysqlMethod.findAll("courses");
      res.locals.courses = result;
      next();
    } catch (e) {
      console.log(`Error fetching courses: ${e.message}`)
      next(e);
    } 
  },

  indexView: async (req,res) => {
    res.render("courses/index");
  },

  new: (req,res) => {
    res.render("courses/new");
  },

  create: async(req,res,next) => {
    //Createのためのデータ型を作成してcreateのqueryを叩く
    try {
      course = {
        id: ULID.ulid(),
        title: req.body.title,
        description: req.body.description,
        maxStudents: req.body.maxStudents,
        cost: req.body.cost
      };
      const result = await mysqlMethod.create("courses", course)
      res.locals.redirect = "/courses";
      res.locals.course = course;
      next()
    } catch (e) {
      console.log(`Error saving course: ${course}`);
      next(e);
    }
  },

  redirectView: async (req,res, next) => {
    let redirectPath = res.locals.redirect;
    if(redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async(req,res,next) => {
    let courseId = req.params.id;
    try {
      const course = (await mysqlMethod.findOneById("courses",courseId))[0]
      res.locals.course = course;
      next()
    } catch(e) {
      console.log(`Error fetching course by ID: ${e.message}`);
      next(e)
    }
  },

  showView: (req,res) => {
    res.render("courses/show");
  },

  edit: async (req,res,next) => {
    try{
      let courseId = req.params.id;
      const course = await mysqlMethod.findOneById("courses",courseId);
      await res.render("courses/edit", {
        course: course[0]
      });
    } catch (e) {
      console.log(`Error fetching course by ID: ${e.message}`);
      next(e);
    }
  },

  update: async(req,res,next) => {
    try {
      const courseId = req.params.id;
      courseParams = {
        id: courseId,
        title: req.body.title,
        description: req.body.description,
        maxStudents: req.body.maxStudents,
        cost: req.body.cost
      };
      const course = await mysqlMethod.findByIdAndUpdate("courses",id,courseParams)
      res.locals.redirect =`/courses/${courseId}`;
      res.locals.course = course;
      next();
    } catch (e){
      console.log(`Error updating courses by ID: ${e.message}`);
      next(e);
    } 
  },

  delete: async(req,res,next) => {
    try {
      let courseId = req.params.id;
      const result = await mysqlMethod.findByIdAndRemove("courses", courseId);
      res.locals.redirect = "/courses";
      next();
    } catch (e) {
      console.log(`Error deleting course by ID: ${e.message}`);
      next(e);
    }
  }
}






