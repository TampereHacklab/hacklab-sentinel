var models  = require('../models');
var express = require('express');
var router  = express.Router();
var moment = require("moment");
var security = require("../utilities/security");

router.post("/create", security.ensureAuthenticated, function(req, res) {
    var state = req.body;

    //This is old device
    models.State.findOrCreate({
        where: {
            id: state.id
        },
        defaults: {
            name: state.name,
            machineName: state.machineName,
            color: state.color
        }

    }).spread(function(mewState, created) {
        if(!created) {
            models.State.update({
                name: state.name,
                machineName: state.machineName,
                color: state.color
            },
            {
                where: {
                    id: state.id
                }
            }).then(function(updated) {
                res.redirect(req.config.baseURL + "/states");
            });
        }
        else {
            res.json(newState);
        }
    });

});
router.get('/edit/:id', security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        user: req.user,
        baseURL: req.config.baseURL
    }
  models.State.findOne({
    where: {
      id: req.params.id
      }
  }).then(function(state) {
        viewbag.state = state;
        res.render("state", viewbag);
      });
    });

router.get("/", security.ensureAuthenticated, function(req, res) {
    var viewbag = {
        states: [],
        user: req.user,
        baseURL: req.config.baseURL,
    };
    models.State.findAll({
        attributes: ["id", "name", "machineName", "color", "createdAt", "updatedAt"]
    }).then(function(states) {
        for(var i = 0; i < states.length; i++) {
            var s = states[i];
            viewbag.states.push({
                id: s.id,
                name: s.name,
                machineName: s.machineName,
                color: s.color,
                created: moment(s.createdAt).format("DD.MM.YYYY HH:mm"),
                updated: moment(s.updatedAt).format("DD.MM.YYYY HH:mm")
            });
        }

        res.render("states", viewbag);
    });

});
module.exports = router;
