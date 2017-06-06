//app engine and mongo database is required
var express = require("express");
//var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
var User = require("./models/Note.js");
var Note = require("./models/User.js");
var HwScrapedData = require("./models/HwScrapedData.js");

mongoose.Promise = Promise;
//require what makes scraping possible!
var request = require("request");
var cheerio = require("cheerio");

//initialize app
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

//Database config
//var databaseUrl = "hwScraper";
//var collections = ["hwScrapedData"];

mongoose.connect("mongodb://localhost/hwScrapedData");
var db = mongoose.connection;

//hook mongojs config to db var --> replaced with Mongoose connection
//var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database error message: "+ error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});
//Main route 

//SCRAPE the DATA!
//define scrape route
app.get("/scrape", function(req, res) {
    //make request
    request("http://reactkungfu.com/", function(error, response, html) {
    //load html from request into cheerio
    var $ = cheerio.load(html);
    //tell it what to find and what to do with it, for each hgroup...
    $('hgroup').each(function(i, element) {
        var result = {};
        //declare variable and save html bit you want
        result.title = $(this).children('h1').children('a').text();
        //what else do you want? declare and store for each instance of element
        result.link = $(this).children('h1').children('a').attr("href");
        //var firstLine = $('this').parent('header').next('.post-lead').children('p').html();
        //for now lets console log the info....
        //console.log(title); -->successfully printed to console! yay... moving on
        //if both of these exist, save to the database!
        var entry = new HwScrapedData(result);
        entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
    });
    res.send("Scrape Complete");
});
    

//simple index
app.get("/", function(req, res) {
  res.send(index.html);
});

//Retrieve the SCRAPED data from the database
app.get("/articles", function(req, res) {
    HwScrapedData.find({}, function(error, dbResult) {
        if (error) {
            console.log(error);
        } else {
            res.json(dbResult);
        }
    });
});

//Retrieve the data from the database
// app.get("/articleNotes", function(req, res) {
//     db.hwScrapedData.find({}, function(error, dbResult) {
//         if (error) {console.log(error)} else {
//             res.send(dbResult);
//         }
//     });
// });

//where should we go? what port?
app.listen(3000, function() {
  console.log("App running on port 3000!");
});