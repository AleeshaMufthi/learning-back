import express from "express";
import isAuthTutor from "../../middleware/tutorAuth.js";
import chatController from "../../controller/chatController.js";

const router = express.Router();

router.route("/enrolled-users").get(isAuthTutor, chatController.onFetchEnrolledStudents);

router.route("/message").get(isAuthTutor, chatController.onGetInstructorMessages);

router.route("/message/:id").get(isAuthTutor, chatController.onFetchInstructorMessages);

export default router