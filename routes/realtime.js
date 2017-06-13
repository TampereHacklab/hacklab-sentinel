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
        user: req.user,
        baseURL: req.baseURL
    }
    models.Settings.findOne({
        where: {
            name: "MQTT_ADDRESS"
        },
        attributes: ["value"]
    }).then(function(mqtt) {
        viewbag.mqtt = mqtt.value;
        res.render("realtime", viewbag);
    });


});

module.exports = router;
