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
            name: ' in [Redacted] servers! Type "!odysee help" for commands!'
        }],
    },
});

const streaming = require('./streaming')(bot);

bot.on("ready", () => {
	console.log(`Discord Bot Connected`)

	const status = require('./status')(bot);
});

bot.on("guildCreate", (guild) => {
	//const channel = guild.channels.cache.get(guild.id);
	//channel.createInvite({ maxAge: 0, maxUses: 0 }).then(invite => {
		//const code = invite.code;
		const name = guild.name;
		const id = guild.id;
		Database_Guild.AddGuild(name,id);//,code);
	//})
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
		if(msg.content === "odysee add add") {
			msg.channel.send('I am unable to do that command with "add".')
		}
		else {
			Database_User.AddUser(msg)
		}
	}

	if(msg.content === "odysee remove all") {
		if(msg.member.roles.cache.some(role => role.name === 'Owner') || msg.member.roles.cache.some(role => role.name === 'Admin') && msg.content === "odysee remove all") {
			Database_User.DeleteAllUsers(msg)
		}
		else {
			msg.channel.send('This command requires you to have one of these role names: "Owner", "Admin"');
		}
	}

	if(msg.content.startsWith("odysee remove") && msg.content !== "odysee remove all") {
		Database_User.DeleteUser(msg)
	}

	if(msg.content.startsWith("odysee notifications")) {
		if(msg.member.roles.cache.some(role => role.name === 'Owner') || msg.member.roles.cache.some(role => role.name === 'Admin')) {
			const notification_channel = msg.content.replace('odysee notifications ', '');
			Database_Guild.UpdateGuildNotificationChannel(notification_channel,msg,bot)
		}
		else {
			msg.channel.send('This command requires you to have one of these role names: "Owner", "Admin"');
		}
	}

	if(msg.content === "odysee help" || msg.content === "odysee command" || msg.content === "odysee commands") {
		const Embed = new MessageEmbed()
            .setColor('#4f1c82')
            .setTitle('Commands')
			.addField('Add 1 User', '!odysee add <user claim id>', false)
			.addField('Add Multiple Users', '!odysee add <user claim id> <user claim id>', false)
			.addField('Remove 1 User', '!odysee remove <user claim id>', false)
			.addField('Remove Multiple Users', '!odysee remove <user claim id> <user claim id>', false)
			.addField('Remove All Users', '``Requires role name of either: "Owner", "Admin"``\n!odysee remove all', false)
			.addField('Get A Count Of All Users', '!odysee list', false)
			.addField('Notifications', '``Requires role name of either: "Owner", "Admin"``\n!odysee notifications <channel id>', false)
			.addField('Example', '!odysee add 1234567890', false);
		msg.channel.send({ embeds: [Embed] });
	}

	if(msg.content === "odysee list") {
		Database_User.GetAllUsers(msg)
	}
});

bot.login(config_data.bot_token);