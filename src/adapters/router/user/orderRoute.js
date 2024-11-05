import express from "express";
import orderController from "../../controller/orderController.js";
import isAuthUser from "../../middleware/userAuth.js";

const router = express.Router();

router.use(isAuthUser);
router.route("/").get(orderController.getAllOrders);
router.route("/create").post(orderController.createOrder);
router.route("/payment/verify").post(orderController.verifyPayment);
router.post('/cancel-order', orderController.cancelOrder);

export default router