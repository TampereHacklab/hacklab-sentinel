var express = require("express");
var router = express.Router();
var models  = require('../models');


/* GET home page. */
router.get("/", function(req, res, next) {
    var viewbag = {
        user: req.user,
        baseURL: req.config.baseURL,
        mqtt: {
            baseTopic: req.config.mqtt.baseTopic,
            broker: req.config.mqtt.broker.ws
        }
    };
    res.render("realtime", viewbag);
});

module.exports = router;
