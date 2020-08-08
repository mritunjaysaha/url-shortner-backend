const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linksSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    shortenUrl: {
        type: String,
    },
});

const Links = mongoose.model("links", deviceSchema);

module.exports = Links;
