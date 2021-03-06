var models  = require('../models');
var express = require('express');
var router  = express.Router();
var moment = require("moment");
var security = require("../utilities/security");

router.post("/create", security.ensureAuthenticated, function(req, res) {
    res.json(req.body);
});
router.get('/edit/:id', security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        dataCollector: null,
        user: req.user,
        baseURL: req.config.baseURL
    }
  models.DataCollector.findOne({
    where: {
      id: req.params.id
      },
      include: [{
              model: models.Input,
              as: "inputs",
              include: [{
                  model: models.Device,
                  as: "device"
              }, {
                  model: models.State,
                  as: "highState",
              },
              {
                  model: models.State,
                  as: "lowState",
              }]
          },

      ]
    }).then(function(dc) {
        viewbag.dataCollector = dc;
        models.Device.findAll({
            attributes: ["id", "name"]
        }).then(function(devices) {
            viewbag.devices = devices;
            models.State.findAll({
                attributes: ["id", "name"]
            }).then(function(states) {
                viewbag.states = states;
                res.render("data-collector", viewbag);
            });
        });
      });
    });

router.get("/", security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        dataCollectors: [],
        user: req.user,
        baseURL: req.config.baseURL,
    };
    models.DataCollector.findAll({
        attributes: ["id", "name", "machineName", "description", "identifier", "createdAt", "updatedAt"]
    }).then(function(dataCollectors) {
        for(var i = 0; i < dataCollectors.length; i++) {
            var dc = dataCollectors[i];
            viewbag.dataCollectors.push({
                id: dc.id,
                name: dc.name,
                machineName: dc.machineName,
                description: dc.description,
                identifier: dc.identifier,
                created: moment(dc.createdAt).format("DD.MM.YYYY HH:mm"),
                updated: moment(dc.updatedAt).format("DD.MM.YYYY HH:mm")
            });
        }

        res.render("data-collectors", viewbag);
    });

});
module.exports = router;
