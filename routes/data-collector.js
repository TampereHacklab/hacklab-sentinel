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

router.get('/edit/:id', function(req, res) {
    var viewbag = {
        dataCollector: null,
        user: req.user
    }
  models.DataCollector.findOne({
    where: {
      id: req.params.id
    }
}).then(function(dc) {
    viewbag.dataCollector = dc;
    res.render("data-collector", viewbag);
  });
});
router.get("/", function(req, res) {
    var viewbag = {
        dataCollectors: [],
        user: req.user
    };
    models.DataCollector.findAll({
        attributes: ["id", "name", "description", "createdAt", "updatedAt"]
    }).then(function(dataCollectors) {
        for(var i = 0; i < dataCollectors.length; i++) {
            var dc = dataCollectors[i];
            viewbag.dataCollectors.push({
                id: dc.id,
                name: dc.name,
                description: dc.description,
                created: moment(dc.createdAt).format("DD.MM.YYYY HH:mm"),
                updated: moment(dc.updatedAt).format("DD.MM.YYYY HH:mm")
            });
        }

        res.render("data-collectors", viewbag);
    });

});
module.exports = router;
