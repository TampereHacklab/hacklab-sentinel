var express = require("express");
var router = express.Router();
var models  = require("../models");
var passport = require("passport");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("login");
});

router.post('/local-login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));

router.get("/logout", function(req, res) {
  console.log("log out");
  req.logout();
  res.redirect("/login");
});

router.post("/register", function(req, res, next) {
  var viewbag = {};
  var bcrypt = require("bcryptjs");
  if(req.body.password != req.body["password-repeat"]) {
    viewbag.passwordError = "Passwords do not match";
  }
  models.User.find({
    where: {
      username: req.body.username
    }
  }).then(function(user) {
    if(user == null) {
      models.User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
      }).then(function(user) {
        console.log("new user created: " + user.username);
        res.redirect("/");
        return;
      });
    }
    else {
      console.log("user exists: " + user.username);
      viewbag.usernameError = "Username already exists"
      res.render("login", viewbag);
      return;
    }

  });


});

module.exports = router;
