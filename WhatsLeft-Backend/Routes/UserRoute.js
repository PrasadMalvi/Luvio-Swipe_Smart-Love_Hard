const express = require("express");
const upload = require("../Middleware/ProifileImageUpload");
const {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
} = require("../Controller/UserController");

const router = express.Router();

// Sign-Up Route
router.post("/signUp", upload.array("profilePics", 4), signUpController);

// Sign-In Route (Email/Password or Mobile/OTP)
router.post("/signIn", signInController);

// Send OTP Route
router.post("/send-otp", sendOtpController);

//TOverufy the OTP
router.post("/verifyOtp", verifyOtpController);

module.exports = router;
