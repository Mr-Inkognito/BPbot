const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
    //guildID
    guildID: String,
    channelID: String,
    text: String
})


module.exports = mongoose.model("welcomeSchema", welcomeSchema);