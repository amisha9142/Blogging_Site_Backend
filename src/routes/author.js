const express = require("express");
const route = express.Router();
const { createAuthor, login } = require("../controllers/author");

route.post("/authorcreate",createAuthor);
route.post("/login",login)

module.exports = route
