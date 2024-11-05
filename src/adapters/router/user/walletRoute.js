import express from "express";
import walletController from "../../controller/walletController.js";
import isAuthUser from "../../middleware/userAuth.js";

const router = express.Router();

router.use(isAuthUser);
router.route("/balance").get(walletController.getWalletBalance);
router.route("/credit").post(walletController.creditWallet);

export default router