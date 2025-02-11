const mongoose = require("mongoose");

const UserData = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Date, required: true }, // Date of birth
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    profilePictures: {
      type: [String],
      required: true,
      minLength: 4,
      maxLength: 10,
    }, // At least 4 images
    relationshipPreference: {
      type: String,
      required: true,
    },
    lookingFor: { type: String, required: true },
    location: { type: String, required: true },
    occupation: { type: String, required: true },
    interests: { type: [String], required: true }, // Array for multiple selections
    hobbies: { type: [String], required: true }, // Array for multiple selections
    aboutMe: { type: String, required: true, maxLength: 500 },
    qualification: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserData);
