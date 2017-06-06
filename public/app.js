//front end js

//get everything in database and add to the page
function getArticles() {
    $("#posts").empty();
    //get all of the data and add to page
    $.getJSON("/articles", function (data) {
        for (var i = 0; i < data.length; i++) {
            //for each article - display on the page
            //check to make sure data is coming back correctly :) yay... moving on.
            //console.log(data[i].title);
            //console.log(data[i].link);
            if (data[i].notes.length > 0) {
            $("#posts").append("<li class='list-group-item post-title' data-id='" + data[i]._id + "'>" + data[i].title + "<br><a href='http://reactkungfu.com/" + data[i].link + "'>Link to article</a><span class='badge'>"+data[i].notes.length+"</span></li>");
            }
            else {
                $("#posts").append("<li class='list-group-item post-title' data-id='" + data[i]._id + "'>" + data[i].title + "<br><a href='http://reactkungfu.com/" + data[i].link + "'>Link to article</a></li>");
            }
            console.log(data[i].notes.length);

        }
    });
}
getArticles();

//onclick to show or activate the notes panel and list historical notes below
var artId;
$(document).on("click", "li", function () {
    console.log("I was clicked");
    // Empty the notes from the note section
    // Save the id from the p tag
    var artId = $(this).attr("data-id");
    $("#addNote").attr("data-id", artId);
    console.log("This is my id: " + artId);
    $('#pNotes').empty()

    $.ajax({
            method: "GET",
            url: "/articles/" + artId
        })
        // With that done, add the note information to the page
        .done(function (data) {
            for (var i = 0; i < data.notes.length; i++) {
                console.log(data.notes[i]);
                if (data.notes[i].title && data.notes[i].body) {
                    $('#pNotes').append("<li class='list-group-item'>Title: <strong>" + data.notes[i].title + "</strong></li>");
                    $('#pNotes').append("<li class='list-group-item'>Comment: " + data.notes[i].body + "</li>");
                    console.log(data.notes.length);
                }
            }
        });
});
//get req.body.note and username and post to database
// When you click the savenote button
$("#addNote").on("click", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // alert("this is the Id of the article " + thisId);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/submit/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section

        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});