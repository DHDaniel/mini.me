// URL shortener microservice. Super awesome stuff.

// necessary imports
const express = require("express");
const mongodb = require("mongodb").MongoClient;
const consolidate = require("consolidate");
const shortid = require("shortid");

var app = express();

// assigning handlebars engine to app
app.engine("html", cons.handlebars);

// telling it templates are identified by .html
app.set("view engine", "html");
app.set("views", __dirname + "/views");

app.get("/", function (req, res) {

  res.end("Welcome");
});
