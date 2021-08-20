config_data = require('./config/config.json')

const MongoDB = require('mongodb').MongoClient;
const mongoose = require('mongoose');
// Users collection
const mongoURI = config_data.mongoURI;
const options = {
    user: config_data.mongoUser,
    pass: config_data.mongoPass,
    keepAlive: "true",
    keepAliveInitialDelay: "300000",
    useNewUrlParser: "true",
	useUnifiedTopology: true
};
mongoose.connect(mongoURI, options);

const Database_User = require('./database/user');
const Database_Guild = require('./database/guild');

const { Client, Intents, MessageEmbed } = require("discord.js");
const bot = new Client({
	forceFetchUsers: true,
	autoReconnect: true,
	intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ],
	presence: {
        status: 'online',
        afk: false,
        activities: [{
            name: ' in [Redacted] servers!'
        }],
    },
});

const streaming = require('./streaming')(bot);

bot.on("ready", () => {
	console.log(`Discord Bot Connected`)

	const status = require('./status')(bot);
});

bot.on("guildCreate", (guild) => {
	const name = guild.name;
	const id = guild.id;
	Database_Guild.AddGuild(name,id);
});

bot.on("guildDelete", (guild) => {
	const name = guild.name;
	const id = guild.id;
	Database_Guild.DeleteGuild(name,id)
});

bot.on("messageCreate", (msg) => {
	if (!msg.content.startsWith('!')) return;
	msg.content = msg.content.substr(1);

	if(msg.author.bot) return;

	if(msg.content.startsWith("odysee add")) {
		const claimId = msg.content.replace('odysee add ', '');
		Database_User.AddUser(claimId,msg)
	}

	if(msg.content.startsWith("odysee remove") || msg.content.startsWith("odysee delete")) {
		const claimId = msg.content.replace('odysee remove ', '');
		Database_User.DeleteUser(claimId,msg)
	}

	if(msg.content.startsWith("odysee notifications")) {
		if(msg.member.roles.cache.some(role => role.name === 'Owner') || msg.member.roles.cache.some(role => role.name === 'Admin')) {
			const notification_channel = msg.content.replace('odysee notifications ', '');
			Database_Guild.UpdateGuildNotificationChannel(notification_channel,msg)
		}
		else {
			msg.channel.send('This command requires you to have one of these role names: "Owner", "Admin"');
		}
	}

	if(msg.content.startsWith("odysee help") || msg.content.startsWith("odysee command") || msg.content.startsWith("odysee commands")) {
		const Embed = new MessageEmbed()
            .setColor('#4f1c82')
            .setTitle('Commands')
			.addField('Add User', '!odysee add <user claim id>', false)
			.addField('Remove User', '!odysee remove <user claim id>', false)
			.addField('Notifications', '``Requires role name of either: "Owner", "Admin"``\n!odysee notification <channel id>', false)
			.addField('Example', '!odysee add 1234567890', false);
		msg.channel.send({ embeds: [Embed] });
	}
});

bot.login(config_data.bot_token);