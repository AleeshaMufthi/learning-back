import express from "express";
import revenueController from "../../controller/revenueController.js";

const router = express.Router();

router.route("/process-payment/:orderId")
      .post(revenueController.processOrderPayment)


export default router 