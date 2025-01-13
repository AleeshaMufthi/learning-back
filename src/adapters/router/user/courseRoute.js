import express from "express";
import courseController from '../../controller/courseController.js'
import isAuthUser from "../../middleware/userAuth.js";
import validateParams from "../../middleware/validateParams.js";

const router = express.Router();

router.route("/").get(courseController.getAllCourses);

router.route("/enroll").all(isAuthUser).get(courseController.getEnrolledCourses).post(courseController.enrollCourse);

router.route("/enroll/:id").get(validateParams, courseController.getSpecificCourse);

router.route("/enrolled/:id").all(isAuthUser).get(validateParams, courseController.enrollValidation, courseController.getSpecificCourse);

export default router


