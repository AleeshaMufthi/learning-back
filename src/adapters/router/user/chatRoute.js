import express from "express";
import isAuthUser from "../../middleware/userAuth.js";
import chatController from "../../controller/chatController.js";

const router = express.Router()

router.route("/enrolled-courses").get(isAuthUser, chatController.onFetchEnrolledCourses)

router.route("/message").post(isAuthUser, chatController.onGetStudentMessages)

router.route("/message/:id").get(isAuthUser, chatController.onFetchAllMessages)

export default router