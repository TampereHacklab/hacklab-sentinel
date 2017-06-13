var models  = require('../models');
var express = require('express');
var router  = express.Router();
var moment = require("moment");
/*
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
*/
router.post("/create", function(req, res) {
    res.json(req.body);
});
router.get('/edit/:id', function(req, res) {
    var viewbag = {
        dataCollector: null,
        user: req.user,
        baseURL: req.baseURL
    }
  models.Device.findOne({
    where: {
      id: req.params.id
      }
  }).then(function(device) {
        viewbag.device = device;
        res.render("device", viewbag);
      });
    });
router.get("/", function(req, res) {
    var viewbag = {
        devices: [],
        user: req.user,
        baseURL: req.baseURL,
    };
    models.Device.findAll({
        attributes: ["id", "name", "machineName", "description", "image", "createdAt", "updatedAt"]
    }).then(function(devices) {
        for(var i = 0; i < devices.length; i++) {
            var d = devices[i];
            viewbag.devices.push({
                id: d.id,
                name: d.name,
                machineName: d.machineName,
                description: d.description,
                identifier: d.identifier,
                created: moment(d.createdAt).format("DD.MM.YYYY HH:mm"),
                updated: moment(d.updatedAt).format("DD.MM.YYYY HH:mm")
            });
        }

        res.render("devices", viewbag);
    });

});
module.exports = router;