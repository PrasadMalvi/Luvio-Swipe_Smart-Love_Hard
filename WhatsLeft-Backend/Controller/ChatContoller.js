const Message = require("../Models/MessageModule");
const CallLog = require("../Models/CallLogModule");
const Chat = require("../Models/ChatsModule");
const { io } = require("../Server");

// 🟢 Send a message (text, image, or video)
const sendMessage = async (req, res) => {
  try {
    const { chatId, receiverId, content, mediaType } = req.body;
    const senderId = req.user.id;
    let mediaUrl = null;

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot send message to yourself" });
    }

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });
    }

    if (!chat) {
      chat = new Chat({ participants: [senderId, receiverId] });
      await chat.save();
    }

    const message = new Message({
      chatId: chat._id,
      sender: senderId,
      content,
      media: mediaUrl,
      mediaType: mediaType || null,
    });

    await message.save();
    chat.lastMessage = message._id;
    await chat.save();

    io.to(receiverId).emit("newMessage", message);

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name profilePictures")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalChats = await Chat.countDocuments({ participants: userId });
    const totalPages = Math.ceil(totalChats / limit);

    res
      .status(200)
      .json({ success: true, chats, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.body;
    await Message.findByIdAndUpdate(messageId, { seen: true });
    res.status(200).json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const logCall = async (req, res) => {
  try {
    const { receiverId, callType, duration, status } = req.body;
    const callerId = req.user.id;

    const callLog = new CallLog({
      caller: callerId,
      receiver: receiverId,
      callType,
      duration,
      status,
    });

    await callLog.save();

    io.to(receiverId).emit("newCallLog", callLog);

    res.status(200).json({ success: true, callLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCallLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const calls = await CallLog.find({
      $or: [{ caller: userId }, { receiver: userId }],
    })
      .populate("caller", "name profilePictures")
      .populate("receiver", "name profilePictures")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalCalls = await CallLog.countDocuments({
      $or: [{ caller: userId }, { receiver: userId }],
    });
    const totalPages = Math.ceil(totalCalls / limit);

    res
      .status(200)
      .json({ success: true, calls, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId: chatId })
      .populate("sender", "name profilePictures")
      .sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    await Message.findByIdAndUpdate(messageId, { content: content });
    res.status(200).json({ success: true, message: "Message updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Message.countDocuments({
      chatId: {
        $in: (
          await Chat.find({ participants: userId })
        ).map((chat) => chat._id),
      },
      sender: { $ne: userId },
      seen: false,
    });
    res.status(200).json({ success: true, unreadCount: unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const searchChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.params;
    const chats = await Chat.find({
      participants: userId,
      "participants.name": { $regex: query, $options: "i" },
    })
      .populate("participants", "name profilePictures")
      .populate("lastMessage");
    res.status(200).json({ success: true, chats: chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const leaveChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    await Chat.findByIdAndUpdate(chatId, { $pull: { participants: userId } });
    res.status(200).json({ success: true, message: "User left chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ... (Previous code)

const addUser = async (req, res) => {
  try {
    const { chatId, newUserId } = req.body;
    await Chat.findByIdAndUpdate(chatId, {
      $push: { participants: newUserId },
    });
    res.status(200).json({ success: true, message: "User added to chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUsersInChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate(
      "participants",
      "name profilePictures"
    );
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }
    res.status(200).json({ success: true, users: chat.participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
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
};
