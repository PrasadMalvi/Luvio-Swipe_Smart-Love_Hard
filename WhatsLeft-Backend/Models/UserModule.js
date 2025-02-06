const mongoose = require("mongoose");

const UserData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your Valid E-Mail"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
      min: 8,
      max: 60,
    },
    mobileNumber: {
      type: String,
      required: [true, "Please enter your 10-digit number"],
      unique: true,
    },
    profilePictures: [
      {
        type: String, // URLs of uploaded images
        required: false,
      },
    ],
    interests: [
      {
        type: String,
        required: false,
      },
    ],
    address: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserData);
