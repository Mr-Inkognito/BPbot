const mongoose = require('mongoose');

const setupSchema = new mongoose.Schema({
    guildID: String,
    autoBan: Boolean,
    warnUsers: Boolean
})


module.exports = mongoose.model("setupSchema", setupSchema);