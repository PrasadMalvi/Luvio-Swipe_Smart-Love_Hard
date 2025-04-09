const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callType: { type: String, enum: ["audio", "video"], required: true },
    duration: { type: Number, default: 0 }, // Duration in seconds
    status: {
      type: String,
      enum: ["missed", "completed", "rejected"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CallLog", callLogSchema);
