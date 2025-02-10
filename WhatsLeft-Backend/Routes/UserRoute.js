const express = require("express");
const {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
  getUserDetails,
} = require("../Controller/UserController");

const authenticate = require("../Middleware/authMiddleware.js");

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

router.post("/signUp", upload.array("profileImage", 5), signUpController);
router.post("/signIn", signInController);
router.post("/send-otp", sendOtpController);
router.post("/verifyOtp", verifyOtpController);
router.get("/getUser", authenticate, getUserDetails);

module.exports = router;
