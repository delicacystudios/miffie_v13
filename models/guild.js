const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    prefix: { type: String },
    channelId: { type: String, required: false },
    messageId: { type: String, required: false }
});

module.exports = mongoose.model('guild', guildSchema);