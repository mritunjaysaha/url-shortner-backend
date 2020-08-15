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
    console.log("signup", email, password);
    if (!email || !password) {
        return res.status(400).send({ message: "need email and password" });
    }

    try {
        User.findOne({ email }, (err, user) => {
            if (err) {
                res.status(500).json({
                    message: { msgBody: "Error has occured", msgError: true },
                });
            }
            if (user) {
                res.status(400).json({
                    message: {
                        msgBody: "Username is already taken",
                        msgError: true,
                    },
                });
            } else {
                const user = User.create(req.body);
                const token = newToken(user);
                return res.status(201).send({
                    message: {
                        msgBody: "Account created successfully",
                        msgError: false,
                    },
                    token,
                });
            }
        });
    } catch (e) {
        return res.status(500).end();
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "need email and password" });
    }

    const invalid = {
        message: {
            msgBody: `Invalid username and password combination`,
            msgError: true,
        },
    };

    try {
        const user = await User.findOne({ email: email })
            .select("email password")
            .exec();

        if (!user) {
            return res.status(401).json(invalid);
        }

        const match = await user.checkPassword(password);

        if (!match) {
            return res.status(401).json(invalid);
        }

        const token = newToken(user);

        return res
            .status(201)
            .json({
                message: { msgBody: "Successfully logged in", msgErr: false },
                token,
            });
    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
};

const signout = async (req, res) => {
    res.clearCookie("token");
    res.json({
        message: {
            msgBody: "Successfully logged out",
            msgError: false,
        },
    });
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
