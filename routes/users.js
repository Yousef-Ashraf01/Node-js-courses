const express = require("express");

const router = express.Router();
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

const verifyToken = require("../middleware/verifyToken");

const usersController = require("../controllers/users");

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.registerUser);

router.route("/login").post(usersController.loginUser);

module.exports = router;
