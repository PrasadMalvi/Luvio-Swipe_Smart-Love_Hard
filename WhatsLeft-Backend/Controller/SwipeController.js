const UserData = require("../Models/UserModule");
const Swipe = require("../Models/SwipeModule");
const Match = require("../Models/SwipeMatchModue");

const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Fetch swipe data for the logged-in user
    const swipeData = await Swipe.findOne({ userId: loggedInUserId });

    let blockedUsers = [];
    let reportedUsers = [];
    let matchedUsers = [];
    let likedUsers = [];
    let superLikedUsers = [];

    if (swipeData) {
      blockedUsers = swipeData.blockedUsers;
      reportedUsers = swipeData.reportedUsers.map(
        (report) => report.reportedUserId
      );
      likedUsers = swipeData.likedUsers;
      superLikedUsers = swipeData.superLikedUsers;
    }

    // Fetch matched users (both user1 and user2 fields)
    const matches = await Match.find({
      $or: [{ user1: loggedInUserId }, { user2: loggedInUserId }],
    });

    matchedUsers = matches.flatMap((match) =>
      match.user1.toString() === loggedInUserId ? match.user2 : match.user1
    );

    // Get all users except the logged-in user, blocked users, reported users, and matched users
    const users = await UserData.find({
      _id: {
        $nin: [
          loggedInUserId,
          ...blockedUsers,
          ...reportedUsers,
          ...matchedUsers,
        ],
      },
    }).select(
      "name age location interests profilePictures occupation relationshipPreference lookingFor hobbies aboutMe height qualification zodiacSign sexualOrientation familyPlans pet drinking smoking workout sleepingHabits gender"
    );

    // Add `isLiked` and `isSuperLiked` flags to each user
    const usersWithSwipeInfo = users.map((user) => ({
      ...user._doc,
      isLiked: likedUsers.includes(user._id.toString()), // Add a flag for liked users
      isSuperLiked: superLikedUsers.includes(user._id.toString()), // Add a flag for super liked users
    }));

    res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.log("getUsers Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSwipeData = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const swipeData = await Swipe.findOne({ userId: loggedInUserId });

    if (!swipeData) {
      // If no swipe data exists for the user, create a new entry
      const newSwipeData = new Swipe({ userId: loggedInUserId });
      await newSwipeData.save();
      return res.status(200).json({
        success: true,
        swipeData: {
          likedUsers: [],
          dislikedUsers: [],
          superLikedUsers: [],
          blockedUsers: [],
          reportedUsers: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      swipeData: {
        likedUsers: swipeData.likedUsers,
        dislikedUsers: swipeData.dislikedUsers,
        superLikedUsers: swipeData.superLikedUsers,
        blockedUsers: swipeData.blockedUsers,
        reportedUsers: swipeData.reportedUsers.map(
          (report) => report.reportedUserId
        ),
      },
    });
  } catch (error) {
    console.error("getSwipeData Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching swipe data",
      error: error.message,
    });
  }
};

const likeUser = async (req, res) => {
  try {
    const { likedUserId } = req.body;
    const loggedInUserId = req.user.id;

    let swipeData = await Swipe.findOne({ userId: loggedInUserId });
    if (!swipeData) {
      swipeData = new Swipe({ userId: loggedInUserId });
    }

    if (!swipeData.likedUsers.includes(likedUserId)) {
      swipeData.likedUsers.push(likedUserId);
      await swipeData.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "User liked successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error liking user",
      error: error.message,
    });
  }
};

/**
 * Dislike a user
 */
const dislikeUser = async (req, res) => {
  try {
    const { dislikedUserId } = req.body;
    const loggedInUserId = req.user.id;

    let swipeData = await Swipe.findOne({ userId: loggedInUserId });
    if (!swipeData) {
      swipeData = new Swipe({ userId: loggedInUserId });
    }

    if (!swipeData.dislikedUsers.includes(dislikedUserId)) {
      swipeData.dislikedUsers.push(dislikedUserId);
      await swipeData.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "User disliked successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error disliking user",
      error: error.message,
    });
  }
};

/**
 * Super Like a user
 */
const superLikeUser = async (req, res) => {
  try {
    const { superLikedUserId } = req.body;
    const loggedInUserId = req.user.id;

    let swipeData = await Swipe.findOne({ userId: loggedInUserId });
    if (!swipeData) {
      swipeData = new Swipe({ userId: loggedInUserId });
    }

    if (!swipeData.superLikedUsers.includes(superLikedUserId)) {
      swipeData.superLikedUsers.push(superLikedUserId);
      await swipeData.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "User super liked successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error super liking user",
      error: error.message,
    });
  }
};

/**
 * Block a user
 */
const blockUser = async (req, res) => {
  try {
    const { blockedUserId } = req.body;
    const loggedInUserId = req.user.id;

    let swipeData = await Swipe.findOne({ userId: loggedInUserId });
    if (!swipeData) {
      swipeData = new Swipe({ userId: loggedInUserId });
    }

    if (!swipeData.blockedUsers.includes(blockedUserId)) {
      swipeData.blockedUsers.push(blockedUserId);
      await swipeData.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error blocking user",
      error: error.message,
    });
  }
};

/**
 * Report a user
 */
const reportUser = async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const loggedInUserId = req.user.id;

    let swipeData = await Swipe.findOne({ userId: loggedInUserId });
    if (!swipeData) {
      swipeData = new Swipe({ userId: loggedInUserId });
    }

    swipeData.reportedUsers.push({ reportedUserId, reason });
    await swipeData.save();

    return res
      .status(200)
      .json({ success: true, message: "User reported successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error reporting user",
      error: error.message,
    });
  }
};

/**
 * Match a user (Check mutual like or superlike)
 */
const matchUser = async (req, res) => {
  try {
    const { matchedUserId } = req.body;
    const loggedInUserId = req.user.id;

    const loggedInUserSwipe = await Swipe.findOne({ userId: loggedInUserId });
    const matchedUserSwipe = await Swipe.findOne({ userId: matchedUserId });

    if (!loggedInUserSwipe || !matchedUserSwipe) {
      return res
        .status(404)
        .json({ success: false, message: "Swipe data not found" });
    }

    // Check for mutual likes or super likes
    const loggedInUserLiked =
      loggedInUserSwipe.likedUsers.includes(matchedUserId);
    const loggedInUserSuperLiked =
      loggedInUserSwipe.superLikedUsers.includes(matchedUserId);
    const matchedUserLiked =
      matchedUserSwipe.likedUsers.includes(loggedInUserId);
    const matchedUserSuperLiked =
      matchedUserSwipe.superLikedUsers.includes(loggedInUserId);

    if (
      (loggedInUserLiked && (matchedUserLiked || matchedUserSuperLiked)) ||
      (loggedInUserSuperLiked && (matchedUserLiked || matchedUserSuperLiked))
    ) {
      const newMatch = new Match({
        user1: loggedInUserId,
        user2: matchedUserId,
      });
      await newMatch.save();

      return res.status(200).json({
        success: true,
        message: "It's a match!",
        matchId: newMatch._id,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "No mutual like or super like" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error matching user",
      error: error.message,
    });
  }
};

/**
 * Unmatch a user
 */
const unmatchUser = async (req, res) => {
  try {
    const { unmatchedUserId } = req.body;
    const loggedInUserId = req.user.id;

    await Match.findOneAndDelete({
      $or: [
        { user1: loggedInUserId, user2: unmatchedUserId },
        { user1: unmatchedUserId, user2: loggedInUserId },
      ],
    });

    return res
      .status(200)
      .json({ success: true, message: "User unmatched successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error unmatching user",
      error: error.message,
    });
  }
};

// In your SwipeController.js

const getMatchDetails = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user ID from auth middleware
    const matchedUserId = req.params.matchedUserId;

    // Logic to find and retrieve match details from your database
    // Example (using Mongoose):
    const match = await Match.findOne({
      $or: [
        { user1: userId, user2: matchedUserId },
        { user1: matchedUserId, user2: userId },
      ],
    });

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    res.status(200).json({ success: true, match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// In your SwipeController.js

const getMatchedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Fetch matched users (both user1 and user2 fields)
    const matches = await Match.find({
      $or: [{ user1: loggedInUserId }, { user2: loggedInUserId }],
    });

    const matchedUserIds = matches.flatMap((match) =>
      match.user1.toString() === loggedInUserId ? match.user2 : match.user1
    );

    // Fetch user data for matched users
    const matchedUsers = await UserData.find({
      _id: { $in: matchedUserIds },
    }).select(
      "name age location interests profilePictures occupation relationshipPreference lookingFor hobbies aboutMe height qualification zodiacSign sexualOrientation familyPlans pet drinking smoking workout sleepingHabits gender"
    );

    res.status(200).json({ success: true, matchedUsers: matchedUsers });
  } catch (error) {
    console.error("getMatchedUsers Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getSwipeData,
  likeUser,
  dislikeUser,
  superLikeUser,
  blockUser,
  reportUser,
  matchUser,
  unmatchUser,
  getMatchDetails,
  getMatchedUsers,
};
