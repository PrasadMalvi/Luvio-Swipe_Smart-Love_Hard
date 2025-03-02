// Server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");
const path = require("path");
const http = require("http");
const socket = require("./Socket"); // Import socket.js
const Message = require("./Models/MessageModule"); // Import Message model
const Chat = require("./Models/ChatsModule"); // Import Chat model

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://192.168.0.100:5050" }));

const PORT = process.env.PORT || 5051;
const JWT_SECRET = process.env.JWT_SECRET;

connectDB();

const server = http.createServer(app);
const io = socket.init(server, JWT_SECRET); // Initialize Socket.IO

// Routes
app.use("/Authentication", require("./Routes/UserRoute"));
app.use("/Swipe", require("./Routes/SwipeRoute"));
app.use("/Chat", require("./Routes/ChatRoute"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on(
    "sendMessage",
    async ({ chatId, receiverId, content, mediaUrl, mediaType }) => {
      try {
        const senderId = socket.user.userId;

        const message = new Message({
          chatId: chatId,
          sender: senderId,
          content,
          media: mediaUrl,
          mediaType: mediaType,
        });

        await message.save();
        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

        io.to(receiverId).emit("newMessage", message);
      } catch (error) {
        console.error("Error sending message via Socket.IO:", error);
      }
    }
  );

  socket.on("videoCall", ({ room, startTime, endTime }) => {
    io.to(room).emit("videoCall", {
      sender: socket.user.userId,
      startTime,
      endTime,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
