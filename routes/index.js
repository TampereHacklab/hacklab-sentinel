var express = require("express");
var router = express.Router();

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
    title: "nyarlathotep",
    user: req.user
  }
  res.render("index", viewbag);
});

router.get("/secret", function(req, res, next) {
  if(req.isAuthenticated()) {
    var viewbag = {
      title: "secret nyarlathotep"
    }
    res.render("index", viewbag);
  }
  else {
    res.redirect("/login");
  }

});

module.exports = router;
