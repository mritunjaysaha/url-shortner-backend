const User = require("../models/user");
const jwt = require("jsonwebtoken");

const newToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "100d",
    });
};

const verifyToken = (token) => {
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return reject(err);
            }

            resolve(payload);
        });
    });
};

const signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "need email and password" });
    }

    try {
        const user = await User.create(req.body);
        const token = newToken(user);
        return res.status(201).send({ token });
    } catch (e) {
        return res.status(500).end();
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "need email and password" });
    }

    const invalid = { message: `Invalid ${email} and ${password} combination` };

    try {
        const user = await User.findOne({ email: email })
            .select("email password")
            .exec();

        if (!user) {
            return res.status(401).send(invalid);
        }

        const match = await user.checkPassword(password);

        if (!match) {
            return res.status(401).send(invalid);
        }

        const token = newToken(user);

        return res.status(201).send({ token });
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
};

const signout = async (req, res) => {
    res.clearCookie("token");
    res.json({ user: { username: "" }, success: true });
};

const protect = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith("Bearer")) {
        return res.status(401).end();
    }

    const token = bearer.split("Bearer")[1].trim();

    let payload;

    try {
        payload = await verifyToken(token);
    } catch (e) {
        return res.status(401).end();
    }

    const user = await User.findById(payload.id)
        .select("-payload")
        .lean()
        .exec();

    if (!user) {
        return res.status(401).end();
    }

    req.user = user;

    next();
};

module.exports = { newToken, verifyToken, signup, signin, signout, protect };
