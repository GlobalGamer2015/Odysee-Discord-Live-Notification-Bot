const Guild = require('./../models/guild');

function AddGuild(name,id) {
    Guild.findOne({id:new RegExp('^' + id + '$', "i")}).exec((err,guild)=> {
        if(err) {
            console.log(err)
        }
        if(guild) {
            
        }
        else if(!guild) {
            var insertGuild = new Guild({
                name: name,
                id: id,
                data: {
                    notification_channel: ""
                }
            })
            insertGuild.save(function (err) {
                if(err) {
                    console.log(err)
                }
            })
        }
    })
}

function DeleteGuild(name,id) {
    Guild.findOne({id:new RegExp('^' + id + '$', "i")}).exec((err,guild)=> {
        if(guild) {
            if(guild.id === id) {
                guild.remove({
                    id: id
                })
            }
        }
    })
}

function SendGuildMessage(bot,Embed) {
    Guild.find({},(err,guilds)=> {
        if(err) {
            console.log(err)
        }
        guilds.forEach(function(guild){
            if(guild.data.notification_channel === "") {
                // Do nothing
            }
            else {
                bot.channels.cache.get(guild.data.notification_channel).send({ embeds: [Embed] });
            }
        })
    })
}

function UpdateGuildNotificationChannel(notification_channel,msg) {
    Guild.find({},(err,guilds)=> {
        if(err) {
            console.log(err)
        }
        guilds.forEach(function(guild){
            if(guild.id === msg.channel.guild.id) {
                guild.data.notification_channel = notification_channel;
                guild.save(function (err) {
                    if(err) {
                        console.log(err)
                    }
                })
                msg.channel.send('Notifications channel has been updated.')
            }
        })
    })
}

module.exports.AddGuild = AddGuild;
module.exports.DeleteGuild = DeleteGuild;
module.exports.SendGuildMessage = SendGuildMessage;
module.exports.UpdateGuildNotificationChannel = UpdateGuildNotificationChannel;