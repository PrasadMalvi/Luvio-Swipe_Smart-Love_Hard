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
      validate: [
        (val) => val.length >= 4 && val.length < 10,
        "Must have 4-10 images",
      ],
    }, // At least 4 images
    relationshipPreference: { type: String, required: true },
    lookingFor: { type: String, required: true },
    height: { type: String, required: false },
    location: { type: String, required: true },
    qualification: { type: String, required: true },
    occupation: { type: String, required: true },
    aboutMe: { type: String, required: true, maxLength: 500 },
    interests: { type: [String], required: true },
    hobbies: { type: [String], required: true },
    zodiacSign: { type: String, required: false },
    sexualOrientation: { type: String, required: false },
    familyPlans: { type: String, required: false },
    pet: { type: String, required: false },
    drinking: { type: String, required: false },
    smoking: { type: String, required: false },
    workout: { type: String, required: false },
    sleepingHabits: { type: String, required: false },
    gender: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserData);
