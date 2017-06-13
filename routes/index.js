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
    user: req.user,
    baseURL: req.baseURL
  }
  res.render("index", viewbag);
});

router.get("/secret", function(req, res, next) {
  if(req.isAuthenticated()) {
    var viewbag = {
      title: "secret hacklab sentinel"
    }
    res.render("index", viewbag);
  }
  else {
    res.redirect("/login");
  }

});

router.get("/dctest", function(req, res) {
    models.DataCollector.findAll({
        include: [{model: models.Input, as: "inputs"}]
    }).then(function(dcs) {
        res.json(dcs);
    })
});
router.get("/inputtest", function(req, res) {
    models.Input.findAll({
        include:  [{model: models.DataCollector, as: "dataCollector"}]
    }).then(function(dcs) {
        res.json(dcs);
    })
});

router.get("/generate", function(req, res) {
    var states = [];
    var newdc = {
        name: "Data collector 1",
        machineName: "DATA_COLLECTOR_1",
        description: "First data collector",
        identifier: "123456789",
        inputs: []

    };
    models.State.create({
        name: "Running",
        machineName: "RUNNING",
        description: "Machine is running",
        color: "#00ff00"
    }).then(function(state) {
        states.push(state);
        models.State.create({
            name: "Idling",
            machineName: "IDLING",
            description: "Machine is idling",
            color: "#0000ff"
        }).then(function(state) {
            states.push(state);
            for(var i = 0; i <= 7; i++) {
                newdc.inputs.push({
                    index: i,
                    fallingDelay: 0,
                    risingDelay: 0,
                    resolution: 300,
                    enabled: true,
                    device: {
                        name: "Device " + (i + 1),
                        machineName: "DEVICE_" + (i + 1),
                        description: "Data producer " + (i + 1)
                    },
                    high_state_id: states[0].id,
                    low_state_id: states[1].id
                });
            }
            models.DataCollector.create(newdc,
                {
                    include: [{
                            model: models.Input,
                            as: "inputs",
                            include: [{
                                model: models.Device,
                                as: "device"
                            },
                            {
                                model: models.State,
                                as: "highState"
                            },
                            {
                                model: models.State,
                                as: "lowState"
                            }]
                        },


                    ]
                }
            ).then(function(dc) {
                res.json(dc);
            });
        });

    });



});
module.exports = router;
