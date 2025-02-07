const express = require("express");
const {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
} = require("../Controller/UserController");

const router = express.Router();

// Sign-Up Route
router.post("/signUp", signUpController);

// Sign-In Route (Email/Password or Mobile/OTP)
router.post("/signIn", signInController);

// Send OTP Route
router.post("/send-otp", sendOtpController);

//TOverufy the OTP
router.post("/verifyOtp", verifyOtpController);

module.exports = router;
