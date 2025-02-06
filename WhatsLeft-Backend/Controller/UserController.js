const UserData = require("../Models/UserModule");
const { hashPassword, comparePassword } = require("../Utils/HashedPassowrd");
const JWT = require("jsonwebtoken");

//Sign-Up Controller
const signUpController = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, profilePictures, interests } =
      req.body;

    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is Required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is Required",
      });
    }
    if (!password || password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password is Required and Should be Greater than 8",
      });
    }
    if (!mobileNumber || (mobileNumber.length < 10 && mobileNumber > 10)) {
      return res.status(400).send({
        success: false,
        message: "Please enter your valid 10 digit number",
      });
    }

    //Check if the user is a Existing User
    const existingUser = await UserData.findOne({ email, mobileNumber });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User Already Exist! PLease Login",
      });
    }

    //hashedPassowrd
    const hashedPassword = await hashPassword(password);

    //Save User
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
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in SignUp API",
      error,
    });
  }
};

module.exports = { signUpController };
