import express from "express";
import courseController from '../../controller/courseController.js'
import isAuthUser from "../../middleware/userAuth.js";
import validateParams from "../../middleware/validateParams.js";
import rbacAuth from "../../middleware/rbacAuth.js";

const router = express.Router();

router.route("/").all(rbacAuth(["admin", "user"])).get(courseController.getAllCourses);

router.route("/enroll").all(isAuthUser).get(courseController.getEnrolledCourses).post(courseController.enrollCourse);

router.route("/enroll/:id").all(rbacAuth(["user"])).get(validateParams, courseController.getSpecificCourse);

router.route("/enrolled/:id").all(isAuthUser).get(validateParams, courseController.enrollValidation, courseController.getSpecificCourse);

export default router


