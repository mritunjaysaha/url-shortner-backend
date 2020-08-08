const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        typed: String,
        required: true,
    },
    links: [{ type: Schema.Types.ObjectId, ref: "links" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
