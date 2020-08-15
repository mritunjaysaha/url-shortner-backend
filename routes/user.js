const express = require("express");
const { me, updateMe } = require("../controllers/user");
const router = express.Router();

router.get("/", me);
router.post("/", updateMe);

module.exports = router;
