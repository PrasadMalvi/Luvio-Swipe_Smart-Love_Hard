const UserData = require("../Models/UserModule");
const { hashPassword, comparePassword } = require("../Utils/HashedPassword");
const JWT = require("jsonwebtoken");
const otpService = require("../Utils/OtpService");

// Sign-Up Controller
const signUpController = async (req, res) => {
  try {
    console.log("Received Request:", req.body, req.files); // Debugging

    const {
      name,
      email,
      password,
      mobileNumber,
      age,
      location,
      occupation,
      aboutMe,
      education,
      relationshipPreference,
      lookingFor,
      interests,
      hobbies,
    } = req.body;

    // Parsing interests and hobbies from JSON string (sent from frontend)
    const parsedInterests = interests ? JSON.parse(interests) : [];
    const parsedHobbies = hobbies ? JSON.parse(hobbies) : [];

    // Handling profile picture uploads
    const profilePictures = req.files?.map((file) => file.path) || [];

    if (
      !name ||
      !email ||
      !password ||
      !mobileNumber ||
      !age ||
      !location ||
      !occupation ||
      !aboutMe ||
      !education ||
      !relationshipPreference ||
      !lookingFor ||
      parsedInterests.length === 0 ||
      parsedHobbies.length === 0 ||
      profilePictures.length < 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required details, including at least 4 profile pictures.",
      });
    }

    // Checking if user already exists
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

    // Create new user
    const newUser = new UserData({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      age,
      location,
      occupation,
      aboutMe,
      education,
      relationshipPreference,
      lookingFor,
      interests: parsedInterests,
      hobbies: parsedHobbies,
      profilePictures, // Array of uploaded file URLs
    });

    await newUser.save();

    // Generate JWT token
    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
      },
      token,
    });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Sign-Up API",
      error: error.message,
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

module.exports = {
  signUpController,
  signInController,
  sendOtpController,
  verifyOtpController,
};
