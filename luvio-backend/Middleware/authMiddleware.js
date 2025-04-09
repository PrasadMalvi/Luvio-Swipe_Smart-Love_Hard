const jwt = require("jsonwebtoken");
const UserData = require("../Models/UserModule");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjust this line to match your JWT payload
    const userId = decoded.userId || decoded._id || decoded.id; // Try common names

    if (!userId) {
      console.log("No userId found in decoded token");
      return res
        .status(401)
        .json({ success: false, message: "Invalid Token Payload" });
    }

    req.user = await UserData.findById(userId).select("-password");

    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (error) {
    console.log("Authentication Error:", error);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = authenticate;
