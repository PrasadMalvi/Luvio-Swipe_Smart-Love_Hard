const UserData = require("../Models/UserModule");
const { hashPassword, comparePassword } = require("../Utils/HashedPassword");
const JWT = require("jsonwebtoken");
const otpService = require("../Utils/OtpService");

// Sign-Up Controller
const signUpController = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, profilePictures, interests } =
      req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      password.length < 8 ||
      !mobileNumber ||
      mobileNumber.length !== 10
    ) {
      return res.status(400).send({
        success: false,
        message:
          "Please provide valid name, email, password (min 8 chars), and 10-digit mobile number",
      });
    }

    // Check if the user already exists
    const existingUser = await UserData.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists! Please log in.",
      });
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Save User
    const newUser = new UserData({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      profilePictures, // Accepts multiple image URLs
      interests, // Array of hobbies/interests
    });

    await newUser.save();
    return res.status(201).send({
      success: true,
      message: "Registration successful! Please log in.",
    });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Sign-Up API",
      error,
    });
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

module.exports = { signUpController, signInController, sendOtpController };
