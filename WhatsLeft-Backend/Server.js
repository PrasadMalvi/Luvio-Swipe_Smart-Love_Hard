const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken"); // Import JWT

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "YOUR_FRONTEND_URL" })); // Replace with your frontend URL

const PORT = process.env.PORT || 5051;
const JWT_SECRET = process.env.JWT_SECRET;

connectDB();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "YOUR_FRONTEND_URL", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Routes
app.use("/Authentication", require("./Routes/UserRoute"));
app.use("/Swipe", require("./Routes/SwipeRoute"));
app.use("/Chat", require("./Routes/ChatRoute"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Socket.IO Authentication Middleware
const socketAuth = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = decoded;
    next();
  });
};

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user.userId);

  socket.on("joinRoom", ({ senderId, recipientId }) => {
    const room = [senderId, recipientId].sort().join("-");
    socket.join(room);
    console.log(`User ${socket.user.userId} joined room ${room}`);
  });

  socket.on("sendMessage", ({ room, message, imageUrl, videoUrl }) => {
    io.to(room).emit("newMessage", {
      sender: socket.user.userId,
      message,
      imageUrl,
      videoUrl,
    });
  });

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

module.exports = { app, io };
