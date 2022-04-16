const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const welcomeSchema = new mongoose.Schema({
    //guildID
    id: reqString,
    channelId: reqString,
    text: reqString
})

const name = "welcome_Schema";

module.exports = mongoose.models[name] || mongoose.model(name, welcomeSchema, name);