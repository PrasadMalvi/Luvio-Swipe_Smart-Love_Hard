const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;

connectDB();

app.use(express.json());
app.use(cors());

//Routes
app.use("/Authentication", require("./Routes/UserRoute"));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
