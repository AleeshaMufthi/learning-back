import express from "express";
import multer from "multer";
import lessonController from '../../controller/lessonController.js'
import isAuthTutor from "../../middleware/tutorAuth.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.route("/")
  .post(
    isAuthTutor,
    upload.single("lesson"),
    lessonController.addLessonToCourse
  );

  export default router