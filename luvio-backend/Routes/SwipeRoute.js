const express = require("express");
const {
  getUsers,
  likeUser,
  dislikeUser,
  superLikeUser,
  blockUser,
  reportUser,
  matchUser,
  unmatchUser,
  getSwipeData,
  getMatchDetails,
  getMatchedUsers,
} = require("../Controller/SwipeController.js");
const authenticate = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.get("/getUsers", authenticate, getUsers);
router.get("/getSwipeData", authenticate, getSwipeData);
router.post("/like", authenticate, likeUser);
router.post("/dislike", authenticate, dislikeUser);
router.post("/superlike", authenticate, superLikeUser);
router.post("/block", authenticate, blockUser);
router.post("/report", authenticate, reportUser);
router.post("/match", authenticate, matchUser);
router.post("/unmatch", authenticate, unmatchUser);
router.get("/match/:matchedUserId", authenticate, getMatchDetails);
router.get("/getMatchedUsers", authenticate, getMatchedUsers);

module.exports = router;
