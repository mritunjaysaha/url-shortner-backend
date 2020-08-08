const express = require("express");
const { me, updateMe } = require("../controllers/user");
const router = express.Router();

router.get("/", me);
router.get("/", updateMe);

module.exports = router;
