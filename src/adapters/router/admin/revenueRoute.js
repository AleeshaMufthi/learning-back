import express from "express";
import revenueController from "../../controller/revenueController.js";

const router = express.Router();

router.route('/')
      .get(revenueController.getAdminRevenue)

export default router