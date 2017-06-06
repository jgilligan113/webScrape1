//front end js

//get everything in database and add to the page
function getPosts() {
    $("#posts").empty();
    //get all of the data and add to page
    $.getJSON("/articles", function(data){
        for (var i = 0; i < data.length; i++) {
            //for each article - display on the page
            //check to make sure data is coming back correctly :) yay... moving on.
            //console.log(data[i].title);
            //console.log(data[i].link);
            $("#posts").append("<li class='list-group-item post-title' data-id='"+data[i]._id+"'>"+data[i].title+"<br><a href='http://reactkungfu.com/"+data[i].link+"'>Link to article</a></li>");
        }   
    });
}

getPosts();

//onclick to show or activate the notes panel and list historical notes below
$(document).on("click", "li", function() {
    console.log("I was clicked");
  // Empty the notes from the note section
  $("#notes").removeAttr("hidden");
  $("#comments").removeAttr("hidden");
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
});
//get req.body.note and username and post to database