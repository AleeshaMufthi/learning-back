import express from "express";
import quizController from "../../controller/quizController.js";
import isAuthUser from "../../middleware/userAuth.js";

const router = express.Router();

router.route("/:courseId").get(quizController.getQuizByCourseId);

export default router;