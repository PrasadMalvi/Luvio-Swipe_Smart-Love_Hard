// controllers/verificationController.js
const faceapi = require("face-api.js");
const fs = require("fs");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const User = require("../Models/UserModule"); // Import your User model
const https = require("https");

async function loadModels() {
  await faceapi.nets.TinyFaceDetector.loadFromDisk("./models");
  await faceapi.nets.FaceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.FaceRecognitionNet.loadFromDisk("./models");
}

async function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve(canvas.loadImage(Buffer.concat(chunks)));
      });
      res.on("error", reject);
    });
  });
}

async function loadProfileImages(userId) {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const imageUrls = user.profilePictures;

    if (!imageUrls || imageUrls.length < 4 || imageUrls.length > 9) {
      throw new Error("Invalid number of profile images.");
    }

    const labeledFaceDescriptors = [];
    for (const imageUrl of imageUrls) {
      try {
        const image = await loadImageFromUrl(imageUrl);
        const detection = await faceapi.detectSingleFace(
          image,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (!detection) {
          console.error(`No face detected in ${imageUrl}`);
          continue;
        }
        const landmarks = await faceapi.detectFaceLandmarks(image);
        const descriptor = await faceapi.computeFaceDescriptor(
          image,
          landmarks
        );
        labeledFaceDescriptors.push(
          new faceapi.LabeledFaceDescriptors(userId, [descriptor])
        );
      } catch (imageError) {
        console.error(`Error loading image from ${imageUrl}:`, imageError);
      }
    }

    return labeledFaceDescriptors;
  } catch (error) {
    console.error("Error loading profile images:", error);
    throw error;
  }
}

async function verifyFace(userId, selfieImagePath) {
  await loadModels();
  const labeledFaceDescriptors = await loadProfileImages(userId);

  if (labeledFaceDescriptors.length === 0) {
    console.error("No profile images with faces found for the user.");
    return false;
  }

  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const selfieImage = await canvas.loadImage(selfieImagePath);
  const selfieDetection = await faceapi.detectSingleFace(
    selfieImage,
    new faceapi.TinyFaceDetectorOptions()
  );

  if (!selfieDetection) {
    console.error("No face detected in selfie.");
    return false;
  }

  const selfieLandmarks = await faceapi.detectFaceLandmarks(selfieImage);
  const selfieDescriptor = await faceapi.computeFaceDescriptor(
    selfieImage,
    selfieLandmarks
  );

  const bestMatch = faceMatcher.findBestMatch(selfieDescriptor);

  if (bestMatch.label === userId && bestMatch.distance < 0.6) {
    return true;
  } else {
    return false;
  }
}

async function processRealtimeSelfie(req, res) {
  try {
    const userId = req.body.userId;
    const selfieBuffer = Buffer.from(req.body.selfie, "base64");

    const tempFilePath = `temp_selfie_${Date.now()}.jpg`;
    fs.writeFileSync(tempFilePath, selfieBuffer);
    const verificationResult = await verifyFace(userId, tempFilePath);
    fs.unlinkSync(tempFilePath);

    res.json({ verified: verificationResult });
  } catch (error) {
    console.error("Error processing realtime selfie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  processRealtimeSelfie,
};
