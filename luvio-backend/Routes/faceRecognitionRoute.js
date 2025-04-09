// routes/verificationRoutes.js
const express = require("express");
const router = express.Router();
const verificationController = require("../Controller/faceRecognitionController");

router.post("/verify", verificationController.processRealtimeSelfie);

module.exports = router;
