const fetch = require('node-fetch');
const User = require('./models/user');
const Discord = require('discord.js');
config_data = require('./config/config.json')
const Database_Guild = require('./database/guild');
const Lbry = require('lbry-sdk-nodejs/lib/sdk');

module.exports = function(bot) {

    setInterval(function() {
        User.find({},(err,users)=> {
            if(err) {
                console.log(err)
            }
            users.forEach(function(user){
                if(user.blacklisted === false) {
                    try {
                        fetch(`https://api.live.odysee.com/v1/odysee/live/${user.claimId}`, {
	    		            method: 'get',
    			            headers: {
				                'Content-Type': 'application/json',
				            }
		                })
                        .then(res => res.json())
	    		        .then(json => {
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
                                    const claim_id = user.claimId;

                                    Lbry.Lbry.claim_search({claim_id: claim_id}).then(result => {
                                        var thumbnail = result.items[0].value.thumbnail.url;
                                        user.live = true;
                                        user.claimData.thumbnail = thumbnail;
                                        user.claimData.name = json.data.claimData.name;
                                        user.claimData.channelLink = json.data.claimData.channelLink;
                                        user.save(function (err) {
                                            if(err) {
                                                console.log(err)
                                            }
                                        })

                                        const Embed = new Discord.MessageEmbed()
                                            .setColor('#4f1c82')
                                            .setTitle(`${user.claimData.name} just went live!`)
                                            .setURL(user.claimData.channelLink)
                                            .setAuthor(`Streamer: ${user.claimData.name}`, 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Odyssey_logo_1.svg/220px-Odyssey_logo_1.svg.png', user.claimData.channelLink)
                                            .setImage(user.claimData.thumbnail)
                                            .setTimestamp()
                                            .addField('\u200B','Hosted by: [Odysee Chatter](https://www.odysee-chatter.com)',true);
                                        Database_Guild.SendGuildMessage(bot,Embed);
                                    })
                                }
                            }
			            })
                    }
                    catch (error) {
                        console.log(error)
                    }
                }
            })
        })
    },60000)
}