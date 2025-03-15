const express = require("express");
const {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
  getUserDetails,
  updateProfileController,
  removeProfileImageController,
  getUserById,
} = require("../Controller/UserController");
const socket = require("../Socket");
const authenticate = require("../Middleware/authMiddleware.js");

const router = express.Router();
const multer = require("multer");

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const io = socket.getIO();
router.post("/signUp", upload.array("profileImage", 5), (req, res) =>
  signUpController(req, res, io)
);
router.post("/signIn", signInController);
router.post("/send-otp", sendOtpController);
router.post("/verifyOtp", verifyOtpController);
router.get("/getUser", authenticate, getUserDetails);
router.put(
  "/updateProfile",
  upload.array("profileImage", 9),
  authenticate,
  updateProfileController
);
router.delete(
  "/removeProfileImage",
  authenticate,
  removeProfileImageController
);
router.get("/getUserById/:userId", authenticate, getUserById);

module.exports = router;
