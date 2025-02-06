const UserData = require("../Models/UserModule");
const JWT = require("jsonwebtoken");

//Sign-Up
const signUpController = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;
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
    //Existing User
    const existingUser = await userModel.findOne({ email, mobileNumber });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User Already Exist! PLease Login",
      });
    }

    //hashedPassowrd
    const hashedPassowrd = await hashedPassowrd(password);

    //Save User
    const user = await UserData({
      name,
      email,
      mobileNumber,
      password: hashedPassowrd,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Registration Successfull! Please Login",
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
