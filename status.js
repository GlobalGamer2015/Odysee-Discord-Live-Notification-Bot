module.exports = function(bot) {
    setInterval(function() {
        bot.user.setActivity(` in ${bot.guilds.cache.size} servers!`, { type: 'PLAYING' })
    },60000)
}