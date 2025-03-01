const UserData = require("../Models/UserModule");
const { hashPassword, comparePassword } = require("../Utils/HashedPassword");
const JWT = require("jsonwebtoken");
const otpService = require("../Utils/OtpService");
const fs = require("fs");
const path = require("path");
const { io } = require("../Server");

// Sign-Up Controller
const signUpController = async (req, res) => {
  try {
    console.log("Received Request:", req.body, req.files);

    const {
      name,
      email,
      password,
      mobileNumber,
      age,
      location,
      occupation,
      aboutMe,
      qualification,
      relationshipPreference,
      lookingFor,
      interests,
      hobbies,
    } = req.body;

    // Ensure arrays are parsed correctly
    const parsedInterests = interests ? JSON.parse(interests) : [];
    const parsedHobbies = hobbies ? JSON.parse(hobbies) : [];

    // Handling profile picture uploads
    const profilePictures = req.files?.map((file) => file.path) || [];

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    if (!mobileNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile number is required." });
    }

    if (!age) {
      return res
        .status(400)
        .json({ success: false, message: "Age is required." });
    }

    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: "Location is required." });
    }

    if (!occupation) {
      return res
        .status(400)
        .json({ success: false, message: "Occupation is required." });
    }

    if (!aboutMe) {
      return res
        .status(400)
        .json({ success: false, message: "About Me section is required." });
    }

    if (!qualification) {
      return res
        .status(400)
        .json({ success: false, message: "Qualification is required." });
    }

    if (!relationshipPreference) {
      return res.status(400).json({
        success: false,
        message: "Relationship preference is required.",
      });
    }

    if (!lookingFor) {
      return res
        .status(400)
        .json({ success: false, message: "Looking for field is required." });
    }

    if (!parsedInterests || parsedInterests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one interest is required.",
      });
    }

    if (!parsedHobbies || parsedHobbies.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one hobby is required." });
    }

    if (!profilePictures || profilePictures.length < 4) {
      return res.status(400).json({
        success: false,
        message: "At least 4 profile pictures are required.",
      });
    }

    // Check if user exists
    const existingUser = await UserData.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists! Please log in.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const ageDate = new Date(age); // Convert age string to Date object
    if (isNaN(ageDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format for age." });
    }
    // Save user
    const newUser = new UserData({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      age: ageDate,
      location,
      occupation,
      aboutMe,
      qualification,
      relationshipPreference,
      lookingFor,
      interests: parsedInterests,
      hobbies: parsedHobbies,
      profilePictures,
    });

    await newUser.save();

    io.emit("newUser", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePictures: newUser.profilePictures,
      age: newUser.age,
      location: newUser.location,
      occupation: newUser.occupation,
      aboutMe: newUser.aboutMe,
      interests: newUser.interests,
      hobbies: newUser.hobbies,
      relationshipPreference: newUser.relationshipPreference,
      lookingFor: newUser.lookingFor,
    });

    // Generate JWT
    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in Sign-Up API" });
  }
};

// Sign-In Controller (Email/Password or Mobile/OTP)
const signInController = async (req, res) => {
  try {
    const { email, password, mobileNumber, otp } = req.body;

    if (!email && !mobileNumber) {
      return res.status(400).send({
        success: false,
        message: "Please provide Email or Mobile Number",
      });
    }

    let user;
    if (email) {
      // User logs in with email and password
      if (!password) {
        return res.status(400).send({
          success: false,
          message: "Password is required",
        });
      }

      user = await UserData.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found. Please sign up first.",
        });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: "Invalid credentials. Please try again.",
        });
      }
    } else if (mobileNumber) {
      // User logs in with mobile number and OTP
      if (!otp) {
        return res.status(400).send({
          success: false,
          message: "OTP is required for login",
        });
      }

      user = await UserData.findOne({ mobileNumber });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found. Please sign up first.",
        });
      }

      // Verify OTP
      const isOtpValid = otpService.verifyOtp(mobileNumber, otp);
      if (!isOtpValid) {
        return res.status(401).send({
          success: false,
          message: "Invalid OTP. Please try again.",
        });
      }
    }

    // Generate JWT Token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Sign-In Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Sign-In API",
      error,
    });
  }
};

// Send OTP for Login
const sendOtpController = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber || mobileNumber.length !== 10) {
      return res.status(400).send({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    // Check if the user exists
    const user = await UserData.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Generate and send OTP
    const otp = otpService.generateOtp(mobileNumber);
    return res.status(200).send({
      success: true,
      message: `OTP sent successfully to ${mobileNumber}`,
      otp, // ⚠️ Remove this in production (only for testing)
    });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in sending OTP",
      error,
    });
  }
};

// Verify OTP Controller
const verifyOtpController = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).send({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    // Check if OTP is valid
    const isOtpValid = otpService.verifyOtp(mobileNumber, otp);
    if (!isOtpValid) {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired OTP. Please try again.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "OTP verified successfully!",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in OTP verification",
      error,
    });
  }
};

// Get User Details Controller
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request

    // Fetch user details from database
    const user = await UserData.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching user details",
    });
  }
};

// UserController.js
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    const updates = req.body;

    // Handling profile picture updates
    if (req.files && req.files.length > 0) {
      updates.profilePictures = req.files.map((file) => file.path);
    }

    const updatedUser = await UserData.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating profile" });
  }
};

const removeProfileImageController = async (req, res) => {
  try {
    const { imageUrl } = req.body; // Get image URL from request body
    const userId = req.user.id; // Get user ID from authentication middleware

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Find the user
    const user = await UserData.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the image exists in the user's profile
    const imageIndex = user.profileImages.indexOf(imageUrl);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in profile" });
    }

    // Remove image from the array
    user.profileImages.splice(imageIndex, 1);
    await user.save();

    // Delete the image from the file system
    const imagePath = path.join(
      __dirname,
      "../uploads",
      path.basename(imageUrl)
    );
    fs.unlink(imagePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Error deleting file:", err);
      }
    });

    res.status(200).json({
      message: "Image removed successfully",
      updatedImages: user.profileImages,
    });
  } catch (error) {
    console.error("Error removing image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserData.findById(userId); // Assuming you're using Mongoose

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
  getUserDetails,
  updateProfileController,
  removeProfileImageController,
  getUserById,
};
