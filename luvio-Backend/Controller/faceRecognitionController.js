const faceapi = require("face-api.js");
const fs = require("fs");
const path = require("path");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch(canvas);

const User = require("../Models/UserModule");

const MODEL_PATH = path.join(__dirname, "../face_models");
let modelsLoaded = false;

// Load FaceAPI models
async function loadModels() {
  if (modelsLoaded) return;
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH),
      faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH),
      faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH),
    ]);
    console.log("✅ FaceAPI Models Loaded Successfully");
    modelsLoaded = true;
  } catch (error) {
    console.error("❌ Error loading FaceAPI models:", error);
  }
}

// Load image from local path or URL
async function loadImage(imagePath) {
  try {
    if (imagePath.startsWith("file://")) {
      imagePath = imagePath.replace("file://", "");
    }
    return await canvas.loadImage(imagePath);
  } catch (error) {
    console.error(`❌ Error loading image: ${imagePath}`, error);
    return null;
  }
}

// Load user profile images
async function loadProfileImages(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const imageUrls = user.profilePictures || [];
    if (imageUrls.length < 4 || imageUrls.length > 9) {
      throw new Error("Invalid number of profile images.");
    }

    const labeledDescriptors = [];
    for (const imageUrl of imageUrls) {
      try {
        const image = await loadImage(imageUrl);
        if (!image) continue;

        const detection = await faceapi
          .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          console.warn(`⚠️ No face detected in ${imageUrl}`);
          continue;
        }

        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(userId, [detection.descriptor])
        );
      } catch (error) {
        console.error(`❌ Error processing ${imageUrl}:`, error);
      }
    }

    return labeledDescriptors;
  } catch (error) {
    console.error("❌ Error loading profile images:", error);
    throw error;
  }
}

// Verify face with selfie
async function verifyFace(userId, selfiePath) {
  await loadModels();

  const labeledDescriptors = await loadProfileImages(userId);
  if (labeledDescriptors.length === 0) {
    console.error("❌ No valid profile images found.");
    return false;
  }

  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

  const selfieImage = await loadImage(selfiePath);
  if (!selfieImage) return false;

  const detection = await faceapi
    .detectSingleFace(selfieImage, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    console.error("❌ No face detected in the selfie.");
    return false;
  }

  const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
  return bestMatch.label === userId && bestMatch.distance < 0.6;
}

// Process real-time selfie
async function processRealtimeSelfie(req, res) {
  try {
    const { userId, selfie } = req.body;
    if (!userId || !selfie)
      return res.status(400).json({ error: "❌ Missing required fields" });

    const tempFilePath = `temp_selfie_${Date.now()}.jpg`;
    fs.writeFileSync(tempFilePath, Buffer.from(selfie, "base64"));

    const verificationResult = await verifyFace(userId, tempFilePath);
    fs.unlinkSync(tempFilePath);

    res.json({ verified: verificationResult });
  } catch (error) {
    console.error("❌ Error processing selfie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { processRealtimeSelfie };
