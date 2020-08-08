const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

const app = express();

const PORT = process.env.port || 8000;

dotenv.config();

app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client", "build")));

const uri = process.env.MONGODB_URI || process.env.URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running at ${PORT}`);
});
