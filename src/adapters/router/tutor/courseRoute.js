import express from "express";
import multer from "multer";
import isAuthTutor from "../../middleware/tutorAuth.js";
import courseContoller from '../../controller/courseController.js'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/create")
      .post(
             isAuthTutor,
             upload.single("thumbnail"),
             courseContoller.handleCourseCreate
           );

router.route("/")
      .get(isAuthTutor, courseContoller.getAllCourseByTutor);

export default router