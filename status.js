module.exports = function(bot) {
    setInterval(function() {
        bot.user.setActivity(` in ${bot.guilds.cache.size} servers! Type "!odysee help" for commands!`, { type: 'PLAYING' })
    },60000)
}