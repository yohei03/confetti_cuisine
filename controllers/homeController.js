module.exports = {
  index: (req, res) => {
    res.render("index");
  },
  logRequestPaths: (req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
  },
  sendReqParam: (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
  },
  respondWithName: (req, res) => {
    res.render("index");
  },
}
