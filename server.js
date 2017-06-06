//app engine and mongo database is required
var express = require("express");
//var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
var Note = require("./models/Note.js");
var HwScrapedData = require("./models/HwScrapedData.js");

mongoose.Promise = Promise;
//require what makes scraping possible!
var request = require("request");
var cheerio = require("cheerio");

//initialize app
var app = express();
var PORT = process.env.PORT || 3000;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

//Database config
//var databaseUrl = "hwScraper";
//var collections = ["hwScrapedData"];

mongoose.connect("mongodb://heroku_rg9xlq09:brq0mrvpeeo4i0unnc56urs2ef@ds163721.mlab.com:63721/heroku_rg9xlq09");
var db = mongoose.connection;

//hook mongojs config to db var --> replaced with Mongoose connection
//var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database error message: " + error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});
//Main route 

//SCRAPE the DATA!
//define scrape route
app.get("/scrape", function (req, res) {
    //make request
    request("http://reactkungfu.com/", function (error, response, html) {
        //load html from request into cheerio
        var $ = cheerio.load(html);
        //tell it what to find and what to do with it, for each hgroup...
        $('hgroup').each(function (i, element) {
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
            entry.save(function (err, doc) {
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
    // res.send("Scrape Complete");
    res.redirect("/");
    console.log("Scrape complete!");
});


//simple index
app.get("/", function (req, res) {
    res.send(index.html);
});

//Retrieve the SCRAPED data from the database
app.get("/articles", function (req, res) {
    HwScrapedData.find({})
        .populate("notes")
        .exec(function (error, dbResult) {
            if (error) {
                console.log(error);
            } else {
                res.json(dbResult);
            }
        });
});

// Route to see notes we have added
app.get("/notes", function (req, res) {
    // Find all notes in the note collection with our Note model
    Note.find({}, function (error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Or send the doc to the browser
        else {
            res.send(doc);
        }
    });
});

// Grab an article by it's ObjectId and show the notes
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    HwScrapedData.findOne({
            "_id": req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("notes")
        // now, execute our query
        .exec(function (error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
                console.log(doc);
            }
        });
});



// New note creation via POST route
app.post("/submit/:id", function (req, res) {
    // Use our Note model to make a new note from the req.body
    var newNote = new Note(req.body);


    // Save the new note to mongoose
    newNote.save(function (error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Otherwise
        else {
            // Find our user and push the new note id into the User's notes array
            HwScrapedData.findOneAndUpdate({
                "_id": req.params.id
            }, {
                $push: {
                    "notes": doc._id
                }
            }, {
                new: true
            }, function (err, newdoc) {
                // Send any errors to the browser
                if (err) {
                    res.send(err);
                }
                // Or send the newdoc to the browser
                else {
                    res.send(newdoc);
                }
            });
        }
    });
});
app.listen(PORT, function() {
    console.log("app listening on PORT", PORT);
});

