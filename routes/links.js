const express = require("express");
const controllers = require("../controllers/links");

const router = express.Router();

// /api/links
router.route("/").get(controllers.getOne).post(controllers.createOne);

// /api/links/:id
router
    .route("/:id")
    .get(controllers.getOne)
    .put(controllers.updateOne)
    .delete(controllers.removeOne);

module.exports = router;
