const mongoose = require('mongoose');

var user = new mongoose.Schema({
    claimId:{unique:true,type:String,required:true}, // Claim ID from About page.
    live:{unique:false,type:Boolean,required:true}, // Automatically set to false.
    claimData: {
        name:{unique:false,type:String,required:false}, // This will be updated later on, which is why required is set to false.
        channelLink:{unique:false,type:String,required:false}, // This will be updated later on, which is why required is set to false.
        thumbnail:{unique:false,type:String,required:false} // This will be updated later on, which is why required is set to false.
    },
    blacklisted:{unique:false,type:Boolean,required:true}
})

module.exports = mongoose.model('User',user)