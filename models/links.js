const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linksSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        shortenUrl: {
            type: String,
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Links = mongoose.model("links", linksSchema);

module.exports = Links;
