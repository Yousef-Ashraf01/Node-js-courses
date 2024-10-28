const User = require("../models/users");
const bcrypt = require("bcryptjs");

const httpStatusText = require("../utils/httpStatusText");
const generateToken = require("../utils/generateToken");

exports.getAllUsers = async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: 0, password: 0 })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
};

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log("Request File: ", req.file);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ status: httpStatusText.ERROR, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  const token = await generateToken({
    email: newUser.email,
    userId: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  const token = await generateToken({
    email: user.email,
    userId: user._id,
    role: user.role,
  });

  if (!isMatch) {
    return res.status(400).json({
      status: httpStatusText.ERROR,
      message: "Invalid email or password",
    });
  }

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Logged in successfully",
    token,
  });
};
