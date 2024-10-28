const express = require("express");

const router = express.Router();

const coursesController = require("../controllers/courses");

const validationSchema = require("../middleware/validationSchema");
const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowedTo");

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(
    verifyToken,
    allowedTo(userRoles.MANAGER),
    validationSchema(),
    coursesController.addCourse
  );

router
  .route("/:courseId")
  .get(coursesController.getCourseById)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteCourse
  );

module.exports = router;
