const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    accessToken: { type: String },
    refreshToken: { type: String }
});

module.exports = mongoose.model('user', userSchema);