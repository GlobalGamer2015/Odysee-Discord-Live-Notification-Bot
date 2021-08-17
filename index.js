config_data = require('./config/config.json')

const MongoDB = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const mongoURI = config_data.mongoURI;
const options = {
    //user: config_data.mongoUser,
    //pass: config_data.mongoPass,
    keepAlive: "true",
    keepAliveInitialDelay: "300000",
    useNewUrlParser: "true",
	useUnifiedTopology: true
};
mongoose.connect(mongoURI, options);
const User = require('./models/user');
const Database = require('./database/user');

const Discord = require("discord.js");
bot = new Discord.Client({
	forceFetchUsers: true,
	autoReconnect: true
});

bot.login(config_data.bot_token);

bot.on("ready", (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Discord Bot Connected`)
	
	const streaming = require('./streaming')(bot);
});

bot.on("message", (msg, channel, err) => {
	if (err) {
		return console.log(err)
	}

	if (!msg.content.startsWith('!')) return;
	msg.content = msg.content.substr(1);
		
	if(msg.author.bot) return;

	if(msg.content.startsWith("odysee add")) {
		const claimId = msg.content.replace('odysee add ', '');
		Database.AddUser(claimId,msg)
	}

	if(msg.content.startsWith("odysee remove")) {
		const claimId = msg.content.replace('odysee remove ', '');
		Database.DeleteUser(claimId,msg)
	}
});