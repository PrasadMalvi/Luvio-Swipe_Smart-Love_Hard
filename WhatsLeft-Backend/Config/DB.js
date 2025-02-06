const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connection Successfull ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Error in Connection database ${error}`);
  }
};

module.exports = connectDB;
