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
      required: [true, "Please enter your Vald E-Mail"],

      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
      min: 8,
      max: 60,
    },
    mobileNumber: {
      type: Number,
      required: [true, "Please enter your 10 digit number"],
      min: 10,
      max: 10,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      required: [false, "Please Enter Address"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserData);
