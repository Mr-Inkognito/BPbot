const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    guildID: String,
    guildName: String, 
    bannedMemberID: String,
    bannedMemberName: String,
    bannedmemberReason: String,
    guildBanCount: Number
});

module.exports = mongoose.model('banSchema', banSchema);
