const Course = require("../models/courses");

const httpStatusText = require("../utils/httpStatusText");

const { validationResult } = require("express-validator");

exports.getAllCourses = async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  
  const courses = await Course.find({}, { __v: 0 }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: httpStatusText.FAIL, message: "Course not found" });
    }
    res.json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch (err) {
    res
      .status(500)
      .json({ status: httpStatusText.ERROR, message: err.message });
  }
};

exports.addCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, error: errors.array()[0].msg });
  }

  const newCourse = new Course(req.body);
  await newCourse.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    let course = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch (err) {
    res
      .status(500)
      .json({ status: httpStatusText.ERROR, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json({
    status: httpStatusText.SUCCESS,
    data: null,
    message: "Course deleted successfully",
  });
};
