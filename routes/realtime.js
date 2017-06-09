var express = require("express");
var router = express.Router();
var models  = require('../models');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.session.error = 'Please sign in!';
    res.redirect('/login');
    return
}
  return;
}

/* GET home page. */
router.get("/", function(req, res, next) {
  var viewbag = {
    title: "hacklab sentinel",
    user: req.user
  }
  res.render("realtime", viewbag);
});

module.exports = router;
