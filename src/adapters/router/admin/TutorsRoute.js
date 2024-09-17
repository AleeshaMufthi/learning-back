import tutorController from "../../controller/tutorController.js";
import isAuthAdmin from "../../middleware/adminAuth.js";
import express from "express";

const router = express.Router()

router.route('/').get(isAuthAdmin,tutorController.getAllTutors)
router.route('/block').post(isAuthAdmin,tutorController.blockTutor)
router.route('/unblock').post(isAuthAdmin,tutorController.unblockTutor)

export default router