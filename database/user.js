config_data = require('./../config/config.json')

function AddUser(msg) {
    const claim_ids = msg.content.replace('odysee add ', '').split(" ");
    const guild_id = msg.channel.guild.id;

    claim_ids.forEach(function(claimId) {
        const MongoClient = require('mongodb').MongoClient,
        f = require('util').format,
        assert = require('assert');

        var url = f(`mongodb://${config_data.mongoUser}:${config_data.mongoPass}@localhost:27017?authSource=admin`)
        
        // Used for local testing
        //var url = f('mongodb://localhost:27017/');

        MongoClient.connect(url, function(err, db) {
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
                        dbo.collection("users").updateOne({claimId: claim_id}, updateUser, function(err, res) {
                            if(err) throw err;
                            msg.channel.send(`${claimId} has been added.`)
                        })
                        db.close();
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
        });
    })
}

function DeleteUser(msg) {
    const claim_ids = msg.content.replace('odysee remove ', '').split(" ");
    const guild_id = msg.channel.guild.id;

    claim_ids.forEach(function(claimId) {
        
        const MongoClient = require('mongodb').MongoClient,
        f = require('util').format,
        assert = require('assert');

        var url = f(`mongodb://${config_data.mongoUser}:${config_data.mongoPass}@localhost:27017?authSource=admin`)
        
        //var url = f('mongodb://localhost:27017/');

        MongoClient.connect(url, function(err, db) {
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
                        dbo.collection("users").updateOne({claimId: claim_id}, updateUser, function(err, res) {
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
        });
    })
}

module.exports.AddUser = AddUser;
module.exports.DeleteUser = DeleteUser;