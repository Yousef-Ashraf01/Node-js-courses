const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");


dotenv.config();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoose = require("mongoose");
const httpStatusText = require("./utils/httpStatusText");

const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use(cors());

app.use(express.json());

const coursesRoutes = require("./routes/courses");

app.use("/api/courses", coursesRoutes);

const userRoutes = require("./routes/users");

app.use("/api/users", userRoutes);

app.all("*", (req, res) => {
  res
    .status(404)
    .json({ status: httpStatusText.ERROR, message: "Page not found" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
