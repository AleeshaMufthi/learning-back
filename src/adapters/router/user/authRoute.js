import express from "express";
import {
  handleLogIn,
  handleRegister,
  handleSignOtp,
  otpResend,
  restoreUserDetails,
  refreshToken 
} from "../../controller/authController.js";

const router = express.Router();

// User Authentication routes
router.route("/signin").post(handleLogIn);
router.route("/signup").post(handleRegister);
router.route("/sendotp").post(handleSignOtp);
router.route("/resendotp").post(otpResend)
router.route("/user/restore").get(restoreUserDetails);
router.route("/token").get(refreshToken);


export default router;
