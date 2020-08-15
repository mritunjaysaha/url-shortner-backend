const User = require("../models/user");

const me = (req, res) => {
    console.info(req.email, "user");
    console.log(res.user, "user");
    res.status(200).json({ data: req.user });
};

const updateMe = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
        })
            .lean()
            .exec();

        return res.status(200).send({ message: "skalklasj" });
    } catch (e) {
        console.error(e);
        return res.status(400).end();
    }
};

module.exports = { me, updateMe };
