var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var msg =new Schema({
    from:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    likes:
    {
        type:[String]
    }
});    
var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    },
    messages:[msg]
});

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User);
