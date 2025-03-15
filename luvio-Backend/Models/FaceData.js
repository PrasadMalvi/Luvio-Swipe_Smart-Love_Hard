const mongoose = require("mongoose");

const FaceDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  faceDescriptors: { type: Array, required: true },
});

module.exports = mongoose.model("FaceData", FaceDataSchema);
