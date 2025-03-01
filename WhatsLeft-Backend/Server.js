const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5051;

connectDB();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//Routes
app.use("/Authentication", require("./Routes/UserRoute"));
app.use("/Swipe", require("./Routes/SwipeRoute"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

module.exports = { app, io };
