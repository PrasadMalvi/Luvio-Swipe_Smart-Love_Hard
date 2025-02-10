const express = require("express");
const { getUsers } = require("../Controller/SwipeController.js");
const authenticate = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get("/getUsers", authenticate, getUsers);

module.exports = router;
