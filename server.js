// URL shortener microservice. Super awesome stuff.

// necessary imports
const express = require("express");
const mongodb = require("mongodb").MongoClient;
const consolidate = require("consolidate");
const shortid = require("shortid");

var app = express();


/*
* CONFIGURATION
*/

// assigning handlebars engine to app
app.engine("html", consolidate.handlebars);

// telling it templates are identified by .html
app.set("view engine", "html");
app.set("views", __dirname + "/views");

// where to find static files
app.use(express.static(__dirname + "/static"));

// allowing Heroku to set up its own port
app.set("port", (process.env.PORT || 8080));


/*
* ROUTING
*/

app.get("/", function (req, res) {

  res.render("index", {

  });
});


/*
* INITIALISING
*/

app.listen(app.get("port"), function () {
  console.log("Listening on port", app.get("port"));
});
