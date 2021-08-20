const mongoose = require('mongoose');

var guild = new mongoose.Schema({
    name:{unique:false,type:String,required:true}, // Guild Name
    id:{unique:true,type:String,required:true}, // Guild Id
    data: {
        notification_channel:{unique:false,type:String,required:false}
    }
})

module.exports = mongoose.model('Guild',guild)