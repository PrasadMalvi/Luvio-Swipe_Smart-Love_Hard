const express = require("express");
const {
  signUpController,
  loginController,
} = require("../Controller/UserController");

const router = express.Router();

//Route for Register
router.post("/signUp", signUpController);

module.exports = router;
