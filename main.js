
const express = require("express"),
  app = express(),
  router = express.Router(),
  mysql =require('mysql2/promise'),
  { body, validationResult } = require('express-validator'),
  methodOverride = require('method-override'),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  layouts = require("express-ejs-layouts")
//connect to mysql

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use("/", router);
router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);

router.use(express.json());
router.use(homeController.logRequestPaths);
router.use(methodOverride("_method", {
  methods: ["POST","GET"]
}));

router.get("/name", homeController.respondWithName);
router.get("/items/:vegetable", homeController.sendReqParam);

router.get("/subscribers", subscribersController.getAllSubscribers);

router.get("/", homeController.index);
router.get("/courses", homeController.showCourses);

router.get("/contact", subscribersController.getSubscriptionPage);
router.post("/subscribe",
body('email').notEmpty().isString(),
(req,res,next) => {
  const result = validationResult(req);
  if(result.isEmpty()) {
    next();
  } else {
    res.send({error: result.array()});
    console.log(result);
    throw new Error("error");
  }
  },
  subscribersController.saveSubscriber
);
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit",usersController.edit);
router.put("/users/:id/update", usersController.update,usersController.redirectView);
router.delete("/users/:id/delete",usersController.delete, usersController.redirectView)

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
