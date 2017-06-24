var models  = require('../models');
var express = require('express');
var router  = express.Router();
var moment = require("moment");
var security = require("../utilities/security");

router.post("/create", security.ensureAuthenticated, function(req, res) {
    var device = req.body;

    //This is old device
    models.Device.findOrCreate({
        where: {
            id: device.id
        },
        defaults: {
            name: device.name,
            machineName: device.machineName,
            description: device.description,
            image: device.image
        }

    }).spread(function(mewDevice, created) {
        console.log(created);
        if(!created) {
            models.Device.update({
                name: device.name,
                machineName: device.machineName,
                description: device.description,
                image: device.image
            },
            {
                where: {
                    id: device.id
                }
            }).then(function(updated) {
                res.redirect(req.config.baseURL + "/devices");
            });
        }
        else {
            res.json(newDevice);
        }
    });

});
router.get('/edit/:id',security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        user: req.user,
        baseURL: req.config.baseURL
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

router.get("/", security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        devices: [],
        user: req.user,
        baseURL: req.config.baseURL,
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
