const express = require("express"),
  app = express(),
  router = express.Router(),
  methodOverride = require('method-override'),
  expressSession = require('express-session'),
  cookieParser = require('cookie-parser'),
  connectFlash = require('connect-flash'),
  {check} = require('express-validator');
  passport = require("passport"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  coursesController = require("./controllers/coursesController"),
  usersController = require("./controllers/usersController"),
  layouts = require("express-ejs-layouts")
//connect to mysql


app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(methodOverride("_method", {
  methods: ["POST","GET"]
}));

app.use("/", router);
router.use(layouts);
router.use(express.static("public"));
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

router.use(cookieParser("secret_passcode"));
router.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));
router.use(connectFlash());

require('./lib/security/accesscontroller')(passport);
router.use(passport.initialize());
router.use(passport.session());

router.use((req,res,next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
next();
});


router.get("/", homeController.index);


//user
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.get("/users/login", usersController.login);
router.post("/users/login", async (req,res,next) => {
  passport.authenticate("local", {
  failureRedirect: "users/login",
  failureFlash: "Failed to login.",
  successRedirect:"/",
  successFlash: "Logged in!"
 })(req,res,next);
},
usersController.redirectView)
router.post("/users/create", [
  check('email').normalizeEmail().trim(),
  check("zipCode").notEmpty().isInt().isLength({
    min: 5,
    max:5
  }),
  check("password", "Password cannot be empty").notEmpty()
],usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/logout",usersController.logout, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit",usersController.edit);
router.put("/users/:id/update", usersController.update,usersController.redirectView);
router.delete("/users/:id/delete",usersController.delete, usersController.redirectView);



//subscribers
router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit",subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update,subscribersController.redirectView);
router.delete("/subscribers/:id/delete",subscribersController.delete, subscribersController.redirectView)


//courses
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit",coursesController.edit);
router.put("/courses/:id/update", coursesController.update,coursesController.redirectView);
router.delete("/courses/:id/delete",coursesController.delete, coursesController.redirectView)


router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
