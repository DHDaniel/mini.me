// URL shortener microservice. Super awesome stuff.

// necessary imports
const express = require("express");
const mongodb = require("mongodb").MongoClient;
const consolidate = require("consolidate");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const validator = require("validator");

var app = express();

var dburl = "mongodb://localhost:27017/local";
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
// For parsing POST requests
app.use(bodyParser.urlencoded({
    extended: false
}));

/*
* ROUTING
*/

app.get("/", function (req, res) {
  var context = {};
  if (req.query.err) {
    context.err = true;
  }
  
  res.render("index", context);
});

// renders your new generated url!!
app.get("/shorten/", function (req, res) {
  var url = req.query.newurl;
  res.render("link", {
    shortened_url : decodeURIComponent(url)
  });
});

// obtaining shortened urls
app.get("/:hash", function (req, res) {

  var hash = req.params.hash;
  console.log(hash);
  mongodb.connect(dburl, function (err, db) {
    if (err) throw err;

    db.collection("urls").find({hash : hash}).toArray(function (err, data) {
      var url = data[0].url;
      db.close();

      res.redirect(url);
    });
  });
})

/*
Schema:

{
  _id : whatever,
  url : "long url",
  hash : "hash"
}
*/
app.post("/api/shorten/", function (req, res) {
  // making sure that we are getting a valid URL. If not, user is redirected to
  // home page with an error message
  var url = (validator.isURL(req.body.url)) ? req.body.url : false;
  if (url === false) {
    return res.redirect("/?err=not a valid URL");
  }

  var hash = shortid.generate();
  console.log(hash);

  mongodb.connect(dburl, function (err, db) {
    if (err) throw err;
    console.log("Connected");
    // object to be inserted into the database
    var urlObject = {
      url : url,
      hash : hash
    }

    // inserting and closing
    var urls = db.collection("urls");
    urls.insert(urlObject, function (err, data) {

      if (err) throw err;
      console.log(data);
      db.close();

      var newUrl = "http://localhost:8080/" + urlObject.hash;
      // exiting and redirecting
      res.redirect("/shorten/?newurl=" + encodeURIComponent(newUrl));
    });
  });
});


/*
* INITIALISING
*/

app.listen(app.get("port"), function () {
  console.log("Listening on port", app.get("port"));
});
