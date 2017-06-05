//app engine and mongo database is required
var express = require("express");
var mongojs = require("mongojs");

//require what makes scraping possible!
var request = require("request");
var cheerio = require("cheerio");

//initialize app
var app = express();

//Database config
var databaseUrl = "hwScraper";
var collections = ["hwScrapedData"];

//hook mongojs config to db var
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database error message: "+ error);
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
        //declare variable and save html bit you want
        var title = $(this).children('h1').children('a').text();
        //what else do you want? declare and store for each instance of element
        var link = $(this).children('h1').children('a').attr("href");
        //var firstLine = $('this').parent('header').next('.post-lead').children('p').html();
        //for now lets console log the info....
        //console.log(title); -->successfully printed to console! yay... moving on
        //if both of these exist, save to the database!
        if(title && link) {
            db.hwScrapedData.save({
                title: title,
                link: link
                //firstLine: firstLine
            }, function(error, saved) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(saved);
                    }
                });
            }
        });
    }); res.send("Scrape Complete");
});




//Retrieve the data from the database
app.get("/all", function(req, res) {
    db.hwScrapedData.find({}, function(error, dbResult) {
        if (error) {console.log(error)} else {
            res.json(dbResult);
        }
    });
});

//where should we go? what port?
app.listen(3000, function() {
  console.log("App running on port 3000!");
});