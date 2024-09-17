import userController from "../../controller/userController.js";
import isAuthAdmin from "../../middleware/adminAuth.js";
import express from "express";

const router = express.Router();

router.route('/').get(isAuthAdmin,userController.getAllUsers)
router.route('/block').post(isAuthAdmin,userController.blockUser)
router.route('/unblock').post(isAuthAdmin,userController.unblockUser)

export default router