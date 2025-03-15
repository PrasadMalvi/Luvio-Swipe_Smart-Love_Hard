// SwipeDataModel.js
const mongoose = require("mongoose");

const SwipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  superLikedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reportedUsers: [
    {
      reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: String,
      reportedAt: { type: Date, default: Date.now },
    },
  ],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("SwipeData", SwipeSchema);
