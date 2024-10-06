import express from "express";
import courseController from '../../controller/courseController.js'

const router = express.Router();

router.route("/").get(courseController.getAllCourses);

export default router