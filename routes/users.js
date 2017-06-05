var models  = require('../models');
var express = require('express');
var router  = express.Router();
var moment = require("moment");

router.post('/create', function(req, res) {
  models.User.create({
    username: req.body.username
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/destroy', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.get("/", function(req, res) {
    var viewbag = {
        users: [],
        user: req.user
    };
    models.User.findAll({
        attributes: ["username", "email", "lastlogin", "createdAt"]
    }).then(function(users) {
        for(var i = 0; i < users.length; i++) {
            var user = users[i];
            viewbag.users.push({
                username: user.username,
                email: user.email,
                lastlogin: moment(user.lastlogin).format("DD.MM.YYYY HH:mm"),
                created: moment(user.createdAt).format("DD.MM.YYYY HH:mm")
            });
        }

        res.render("users", viewbag);
    });

});
module.exports = router;
