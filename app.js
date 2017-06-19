var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
//From authentication tutorial(https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/)
var session = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local");

var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, 'config', 'config.json'))[env];

var routes = require("./routes/index");
var users = require("./routes/users");
var login = require("./routes/login");
var realtime = require("./routes/realtime");
var dataCollectors = require("./routes/data-collector");
var devices = require("./routes/device");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//serve client side js/css/fonts
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist")); // redirect JS jQuery
app.use("/js", express.static(__dirname + "/node_modules/mqtt/dist")); // redirect JS jQuery
app.use("/js", express.static(__dirname + "/node_modules/moment/min")); // redirect JS jQuery
app.use("/js", express.static(__dirname + "/node_modules/croppie"));
app.use("/js", express.static(__dirname + "/public/javascripts")); // redirect JS jQuery
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // redirect CSS bootstrap
app.use("/css", express.static(__dirname + "/node_modules/croppie"));
app.use("/css", express.static(__dirname + "/public/stylesheets")); // redirect CSS bootstrap
app.use("/fonts", express.static(__dirname + "/node_modules/bootstrap/dist/fonts"));
app.use("/images", express.static(__dirname + "/public/images"));

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb" , extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//From authentication tutorial(https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/)
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
  function(username, password, done) {
    var models = require("./models");
    var bcrypt = require("bcryptjs");
    models.User.find({
      where: {
        username: username
      }
    }).then(function(user) {
      if(user == null) {
        console.log("incorrect username: " + username);
        return done(null, false, { message: "incorrect username" });
      }
      else {
        console.log("user found");
        if(bcrypt.compareSync(password, user.password)) {
          console.log("successful login");
          return done(null, user);
        }
        else {
          console.log("incorrect password for: " + username);
          return done(null, false, { message: "incorrect password" });
        }
      }

    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});
app.use(function(req, resp, next) {
    req.config = {
        baseURL: config["baseURL"],
        mqtt: {
            broker: {
                ws: config["mqtt-broker-ws"],
                tcp: config["mqtt-broker-tcp"]
            },
            baseTopic: config["mqtt-base-topic"]
        }
    }
    next();
});
app.use("/", routes);
app.use("/users", users);
app.use("/login", login);
app.use("/data-collectors", dataCollectors);
app.use("/devices", devices);
app.use("/realtime", realtime);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

var datagate = require("./puppets/datagate.js");
datagate.initialize({
    broker: config["mqtt-broker-tcp"],
    baseTopic: config["mqtt-base-topic"],
    checksumSalt: config["mqtt-checksum-salt"]
});

module.exports = app;
