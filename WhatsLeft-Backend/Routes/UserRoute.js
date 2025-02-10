const express = require("express");
const {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
} = require("../Controller/UserController");

const router = express.Router();
const multer = require("multer");

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Corrected: Ensure `profileImage` is used correctly
router.post("/signUp", upload.array("profileImage", 5), signUpController);
router.post("/signIn", signInController);
router.post("/send-otp", sendOtpController);
router.post("/verifyOtp", verifyOtpController);

module.exports = router;
