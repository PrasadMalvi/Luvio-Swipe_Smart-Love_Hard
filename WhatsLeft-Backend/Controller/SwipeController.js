const UserData = require("../Models/UserModule");

const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const users = await UserData.find({ _id: { $ne: loggedInUserId } })
      .select(
        "name age location interests profilePictures occupation relationshipPreference lookingFor hobbies aboutMe"
      )
      .limit(10);

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
