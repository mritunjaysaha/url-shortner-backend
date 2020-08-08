const { crudControllers } = require("./db-controllers");
const Links = require("../models/links");

module.exports = crudControllers(Links);
