const fetch = require('node-fetch');
const User = require('./models/user');
const Discord = require('discord.js');
config_data = require('./config/config.json')

module.exports = function(bot) {
    setInterval(function() {
        User.find({},(err,users)=> {
            if(err) {
                console.log(err)
            }
            users.forEach(function(user){
                fetch(`https://api.live.odysee.com/v1/odysee/live/${user.claimId}`, {
	    		    method: 'get',
    			    headers: {
				        'Content-Type': 'application/json',
				    }
		        })
		        .then(res => res.json())
	    		.then(json => {
    			    console.log(json)
                    if(json.data.live === false) {
                        if(user.live === true) {
                            user.live = false;
                            user.save(function (err) {
                                if(err) {
                                    console.log(err)
                                }
                            })
                        }
                    }
                    else if(json.data.live === true) {
                        if(user.live === false) {
                            user.live = true;
                            user.claimData.thumbnail = json.data.thumbnail;
                            user.claimData.name = json.data.claimData.name;
                            user.claimData.channelLink = json.data.claimData.channelLink;
                            user.save(function (err) {
                                if(err) {
                                    console.log(err)
                                }
                            })

                            const Embed = new Discord.RichEmbed()
                                .setColor('#4f1c82')
                                .setTitle(`${json.data.claimData.name} just went live!`)
                                .setURL(json.data.claimData.channelLink)
                                .setAuthor(`Streamer: ${json.data.claimData.name}`, '', json.data.claimData.channelLink) // The '' is supposed to be stream thumbnail but CDN preview image comes back as 403 Forbidden.
                                .setImage('https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Odyssey_logo_1.svg/220px-Odyssey_logo_1.svg.png')
                                .setTimestamp();
                            bot.channels.get(config_data.notification_channel).send('', { embed: Embed });
                        }
                    }
			    })
            })
        })
    },60000)
}