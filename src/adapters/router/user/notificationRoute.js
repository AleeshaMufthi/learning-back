import express from "express";
import isAuthUser from "../../middleware/userAuth.js";
import notificationController from "../../controller/notificationController.js";

const router = express.Router()

router.route("/").get(isAuthUser, notificationController.getAllNotifications)

router.route('/:id').put(isAuthUser, notificationController.markNotificationAsRead)

export default router