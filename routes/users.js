var models  = require('../models');
var express = require('express');
var router  = express.Router();
var moment = require("moment");
var passport = require("passport");
var security = require("../utilities/security");

router.post('/create', security.ensureAuthenticated, function(req, res) {
  models.User.create({
    username: req.body.username
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/destroy', security.ensureAuthenticated, function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.get("/", security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        users: [],
        user: req.user,
        baseURL: req.config.baseURL
    };
    models.User.findAll({
        attributes: ["username", "email", "lastLogin", "createdAt"]
    }).then(function(users) {
        for(var i = 0; i < users.length; i++) {
            var user = users[i];
            viewbag.users.push({
                username: user.username,
                email: user.email,
                lastlogin: user.lastLogin != null ? moment.duration(moment(new Date()).diff(moment(user.lastLogin))).humanize() : "n/a",
                created: moment(user.createdAt).format("DD.MM.YYYY HH:mm")
            });
        }

        res.render("users", viewbag);
    });

});
module.exports = router;
