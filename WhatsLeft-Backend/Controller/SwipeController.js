const UserData = require("../Models/UserModule");

const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // Get logged-in user from JWT
    console.log("Fetching users for:", loggedInUserId);

    const users = await UserData.find({ _id: { $ne: loggedInUserId } }) // Exclude logged-in user
      .select("name age location interests profilePictures")
      .limit(10); // Limit to 10 users

    console.log("Fetched Users:", users);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
};
