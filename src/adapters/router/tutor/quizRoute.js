import quizController from "../../controller/quizController.js";
import express from "express";

const router = express.Router();

router.post('/create', quizController.createQuiz);

router.get('/:courseId', quizController.getQuizByCourseId);

router.get('/:quizId', quizController.getQuizById);

export default router