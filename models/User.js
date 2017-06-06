//require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        unique: true
    }
});

var User = mongoose.model("User", UserSchema);

//export l'user, not to be confused wtih loser
module.exports = User;

