const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: Date.now
    },
})

module.exports = User = mongoose.model("users", UserSchema);