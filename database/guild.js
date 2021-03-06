const Guild = require('./../models/guild');
config_data = require('./../config/config.json')

const MongoClient = require('mongodb').MongoClient,
f = require('util').format,
assert = require('assert');
var user = encodeURIComponent(config_data.mongoUser);
var password = encodeURIComponent(config_data.mongoPass);
var authMechanism = 'DEFAULT';

var url = f('mongodb://localhost:27017/', user, password, authMechanism);
        
// Used for local testing
//var url = f('mongodb://localhost:27017/');

MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    function AddGuild(name,id) {//,code) {
        Guild.findOne({id:new RegExp('^' + id + '$', "i")}).exec((err,guild)=> {
            if(err) {
                console.log(err)
            }
            if(guild) {
                if(guild.id === id) {
                    guild.disabled = false;
                    //guild.code = code;
                    guild.save(function (err) {
                        if(err) {
                            console.log(err)
                        }
                    })
                }
            }
            else if(!guild) {
                var insertGuild = new Guild({
                    name: name,
                    id: id,
                    data: {
                        notification_channel: ""
                    },
                    disabled: false,
                    //code: code
                })
                insertGuild.save(function (err) {
                    if(err) {
                        console.log(err)
                    }
                })

            
                // Checks if database exists
                if(db.db(`discord_${id}`)) {
                    // Exists
                }
                else {
                    // Does not exist, so we will create it
                    db.db(`discord_${id}`).createCollection("users", function(err, res) {
                        if (err) throw err;
                    });
                }
            }
        })
    }

    module.exports.AddGuild = AddGuild;
});

function DeleteGuild(name,id) {
    Guild.findOne({id:new RegExp('^' + id + '$', "i")}).exec((err,guild)=> {
        if(guild) {
            if(guild.id === id) {
                guild.disabled = true;
                guild.save(function (err) {
                    if(err) {
                        console.log(err)
                    }
                })
            }
        }
    })
}

function UpdateGuildNotificationChannel(notification_channel,msg,bot) {
    Guild.find({},(err,guilds)=> {
        if(err) {
            console.log(err)
        }
        guilds.forEach(function(guild){
            if(guild.id === msg.channel.guild.id) {
                try {
                    bot.channels.cache.get(notification_channel).id
                    guild.data.notification_channel = notification_channel;
                    guild.save(function (err) {
                        if(err) {
                            console.log(err)
                        }
                    })
                    msg.channel.send('Notifications channel has been updated.')
                }
                catch(error) {
                    msg.channel.send(`Channel "${notification_channel}" not found, are you sure that is correct?`)
                }
            }
        })
    })
}

module.exports.DeleteGuild = DeleteGuild;
module.exports.UpdateGuildNotificationChannel = UpdateGuildNotificationChannel;