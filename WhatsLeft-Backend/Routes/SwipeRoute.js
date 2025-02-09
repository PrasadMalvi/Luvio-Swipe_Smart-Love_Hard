const express = require("express");
const { getUsers } = require("../Controller/SwipeController.js");
const { verifyToken } = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get("/getUsers", verifyToken, getUsers);

module.exports = router;
