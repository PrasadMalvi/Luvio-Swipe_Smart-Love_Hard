const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

module.exports = {
  init: (server, JWT_SECRET) => {
    io = socketIo(server, {
      cors: {
        origin: ["http://localhost:5050", "http://192.168.0.100:5050"], // Add allowed origins
        methods: ["GET", "POST"],
        credentials: true, // Allow credentials
      },
    });

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

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.IO not initialized");
    }
    return io;
  },
};
