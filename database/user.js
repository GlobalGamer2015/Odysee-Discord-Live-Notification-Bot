const User = require('./../models/user');

function AddUser(claimId,msg) {
    User.find({},(err,users)=> {
        if(err) {
            console.log(err)
        }
        if(users = '[]') { // If users collection is empty
            var insertUser = new User({
                claimId: claimId,
                live: false,
                claimData: {
                    name: "",
                    channelLink: "",
                    thumbnail: ""
                }
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
        else if(users != '[]') { // if users collection is not empty
            users.forEach(function(user){
                if(user.claimId === claimId) {
                    msg.channel.send(`${claimId} exists.`)
                }
                else if(user.claimId !== claimId) {
                    var insertUser = new User({
                        claimId: claimId,
                        live: false,
                        claimData: {
                            name: "",
                            channelLink: "",
                            thumbnail: ""
                        }
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
    })
}

function DeleteUser(claimId,msg) {
    User.find({},(err,users)=> {
        if(err) {
            console.log(err)
        }
        users.forEach(function(user){
            if(user.claimId === claimId) {
                user.remove({
                    claimId: claimId
                })
                msg.channel.send(`${claimId} has been removed.`)
            }
        })
    })
}

module.exports.AddUser = AddUser;
module.exports.DeleteUser = DeleteUser;