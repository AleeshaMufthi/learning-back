import express from "express";
import adminDashboardController from "../../controller/adminDashboardController.js";

const router = express.Router()

router.route('/').get(adminDashboardController.getDashboardCounts)

export default router