const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { signup, signin, signout, protect } = require("./controllers/auth");
const userRouter = require("./routes/user");
const linkRouter = require("./routes/links");

const app = express();

const PORT = process.env.port || 8000;

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
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

app.post("/signup", signup);
app.post("/signin", signin);
app.post("/signout", signout);
// app.use("/api", protect);
app.use("/api/user", userRouter);
app.use("/api/links", linkRouter);

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
