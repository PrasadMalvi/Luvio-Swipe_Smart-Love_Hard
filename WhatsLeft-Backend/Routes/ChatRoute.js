const express = require("express");
const authenticate = require("../Middleware/authMiddleware.js");
const uploadMiddleware = require("../Middleware/uploadMiddleware.js");
const {
  sendMessage,
  getMyChats,
  markAsSeen,
  logCall,
  getCallLogs,
  getChat,
  deleteMessage,
  editMessage,
  getUnreadCount,
  searchChats,
  leaveChat,
  addUser,
  getUsersInChat,
} = require("../Controller/ChatContoller.js");
const {
  validateSendMessage,
} = require("../Middleware/validationMiddleware.js");

const router = express.Router();

router.post(
  "/sendMessage",
  authenticate,
  uploadMiddleware.single("media"), // Use the middleware
  validateSendMessage, // Use validation middleware.
  sendMessage
);
router.get("/getMyChats", authenticate, getMyChats);
router.post("/markAsSeen", authenticate, markAsSeen);
router.post("/logCall", authenticate, logCall);
router.get("/getCallLogs", authenticate, getCallLogs);
router.get("/getChat/:chatId", authenticate, getChat);
router.delete("/deleteMessage/:messageId", authenticate, deleteMessage);
router.put("/editMessage/:messageId", authenticate, editMessage);
router.get("/getUnreadCount", authenticate, getUnreadCount);
router.get("/searchChats/:query", authenticate, searchChats);
router.post("/leaveChat/:chatId", authenticate, leaveChat);
router.post("/addUser/:chatId", authenticate, addUser);
router.get("/getUsersInChat/:chatId", authenticate, getUsersInChat);

module.exports = router;
