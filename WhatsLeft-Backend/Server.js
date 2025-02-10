const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;

connectDB();

app.use(express.json());
app.use(cors());

//Routes
app.use("/Authentication", require("./Routes/UserRoute"));
app.use("/Swipe", require("./Routes/SwipeRoute"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
