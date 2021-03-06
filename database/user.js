config_data = require('./../config/config.json')

const MongoClient = require('mongodb').MongoClient,
f = require('util').format,
assert = require('assert');

var url = f(`mongodb://${config_data.mongoUser}:${config_data.mongoPass}@localhost:27017?authSource=admin`)
        
// Used for local testing
//var url = f('mongodb://localhost:27017/');

MongoClient.connect(url, function(err, db) {

    function AddUser(msg) {
        const claim_ids = msg.content.replace('odysee add ', '').split(" ");
        const guild_id = msg.channel.guild.id;

        claim_ids.forEach(function(claimId) {
            if (err) throw err;

            var dbo = db.db(`discord_${guild_id}`);
            dbo.collection("users").findOne({claimId:new RegExp('^' + claimId + '$', "i")}, function(err, user) {
                if(err) {
                    console.log(err)
                }
                if(user) {
                    if(user.disabled === true) {
                        var updateUser = {
                            $set: {
                                disabled: false
                            }
                        }
                        dbo.collection("users").updateOne({claimId: claimId}, updateUser, function(err, res) {
                            if(err) throw err;
                            msg.channel.send(`${claimId} has been added.`)
                        })
                    }
                    else if(user.disabled === false) {
                        msg.channel.send(`${claimId} exists.`)
                    }
                }
                else if(!user) {
                    var userObject = {
                        claimId: claimId,
                        live: false,
                        claimData: {
                            name: "",
                            streamLink: "",
                            thumbnail: ""
                        },
                        disabled: false,
                        blacklisted: false
                    }
                    dbo.collection("users").insertOne(userObject, function(err, res) {
                        if(err) throw err;
                        msg.channel.send(`${claimId} has been added.`)
                    })
                }
            })
        })
    }

    function DeleteUser(msg) {
        const claim_ids = msg.content.replace('odysee remove ', '').split(" ");
        const guild_id = msg.channel.guild.id;

        claim_ids.forEach(function(claimId) {
            if (err) throw err;

            var dbo = db.db(`discord_${guild_id}`);
            dbo.collection("users").findOne({claimId:new RegExp('^' + claimId + '$', "i")}, function(err, user) {
                if(err) {
                    console.log(err)
                }
                if(user) {
                    if(user.disabled === false) {
                        var updateUser = {
                            $set: {
                                disabled: true
                            }
                        }
                        dbo.collection("users").updateOne({claimId: claimId}, updateUser, function(err, res) {
                            if(err) throw err;
                            msg.channel.send(`${claimId} has been removed.`)
                        })
                    }
                    else if(user.disabled === true) {
                        msg.channel.send(`${claimId} does not exist.`)
                    }
                }
                else if(!user) {
                    msg.channel.send(`${claimId} does not exist.`)
                }
            })
        })
    }

    function DeleteAllUsers(msg) {
        const guild_id = msg.channel.guild.id;

            var dbo = db.db(`discord_${guild_id}`);
            dbo.collection("users").find({}).toArray(function(err, users) {
                if(err) {
                    console.log(err)
                }

                if(users.length >= 1) {
                    // Users
                    msg.channel.send(`Your claim id database will be wiped clean, it may take a few minutes if you have a lot of claim ids.`)
                    users.forEach(user => {
                        const claimId = user.claimId;
                        dbo.collection("users").deleteOne({claimId: claimId}, function(err, res) {
                            if(err) throw err;
                        })
                    })
                    msg.channel.send(`Your claim id database is wiped.`)
                }
                else if(users.length === 0) {
                    // No users
                    msg.channel.send("Your claim id database is empty.")
                }
            })
    }

    function GetAllUsers(msg) {
        const guild_id = msg.channel.guild.id;

            var dbo = db.db(`discord_${guild_id}`);
            dbo.collection("users").find({}).toArray(function(err, users) {
                if(err) {
                    console.log(err)
                }

                if(users.length >= 1) {
                    msg.channel.send(`Your claim id database has ${users.length} ids.`)
                }
                else if(users.length === 0) {
                    // No users
                    msg.channel.send("Your claim id database is empty.")
                }
            })
    }

    module.exports.AddUser = AddUser;
    module.exports.DeleteUser = DeleteUser;
    module.exports.DeleteAllUsers = DeleteAllUsers;
    module.exports.GetAllUsers = GetAllUsers;
})