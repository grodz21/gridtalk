var mongoose = require('mongoose');

// define the schema for our post model
var messageSchema = mongoose.Schema({
	
        userID		: {type:String, required: true, ref: "User"},
        message     : {type:String, required: true},
        date     	: {type:Date, default: Date.now}
    

});




// create the model for post messages and expose it to our app
module.exports = mongoose.model('Message', messageSchema);