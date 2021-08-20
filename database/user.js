const User = require('./../models/user');

function AddUser(claimId,msg) {
    User.findOne({claimId:new RegExp('^' + claimId + '$', "i")}).exec((err,user)=> {
        if(err) {
            console.log(err)
        }
        if(user) {
            msg.channel.send(`${claimId} exists.`)
        }
        else if(!user) {
            var insertUser = new User({
                claimId: claimId,
                live: false,
                claimData: {
                    name: "",
                    channelLink: "",
                    thumbnail: ""
                },
                blacklisted: false
            })
            insertUser.save(function (err) {
                if(err) {
                    console.log(err)
                }
                else {
                    msg.channel.send(`${claimId} has been added.`)
                }
            })
        }
    })
}

function DeleteUser(claimId,msg) {
    User.findOne({claimId:new RegExp('^' + claimId + '$', "i")}).exec((err,user)=> {
        if(err) {
            console.log(err)
        }
        if(user) {
            if(user.claimId == claimId) {
                user.remove({
                    claimId: claimId
                })
                msg.channel.send(`${claimId} has been removed.`)
            }
        }
        else {
            msg.channel.send(`${claimId} does not exist.`)
        }
    })
}

module.exports.AddUser = AddUser;
module.exports.DeleteUser = DeleteUser;