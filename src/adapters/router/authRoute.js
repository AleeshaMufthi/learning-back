import express from "express";
import authController from "../controller/authController.js";
import tutorAuthController from "../controller/tutorAuthController.js";
import adminAuthController from "../controller/adminAuthController.js";
import isAuthTutor from "../middleware/tutorAuth.js";
import isAuthUser from "../middleware/userAuth.js";
import isAuthAdmin from '../middleware/adminAuth.js'

const router = express.Router();

// User Authentication routes
router.route("/signin").post(authController.handleLogIn);
router.route("/signup").post(authController.handleRegister);
router.route("/sendotp").post(authController.handleSignOtp);
router.route("/forgetPassword").post(authController.handleForgetPassword);
router.route("/resetPassword").post(authController.handleResetPassword);
// router.route("/verifyOtp").post(authController.verifyOtp)
router.route("/google").post(authController.loginGoogleAuth)
router.route("/user/restore").get(isAuthUser, authController.restoreUserDetails);
router.route("/token").get(authController.refreshToken);
router.route("/logout").delete(authController.handleLogout);

// Tutor Authentication routes
router.route("/tutor/signin").post(tutorAuthController.handleSignIn);
router.route("/tutor/signup").post(tutorAuthController.handleSignUp);
router.route("/tutor/sendotp").post(tutorAuthController.handleSignOtp);
router.route("/tutor/forgetPassword").post(tutorAuthController.handleForgetPassword);
router.route("/tutor/resetPassword").post(tutorAuthController.handleResetPassword)
router.route("/tutor/restore").get(isAuthTutor, tutorAuthController.restoreUserDetails);
router.route("/tutor/token").get(tutorAuthController.refreshToken);
router.route("/tutor/logout").delete(tutorAuthController.handleLogout);

// Admin Authentication routes
router.route("/admin/signin").post(adminAuthController.handleSignIn);
router.route("/admin/signup").post(adminAuthController.handleSignUp);
router.route("/admin/sendotp").post(adminAuthController.handleSignOtp);
router.route("/admin/restore").get(isAuthAdmin, adminAuthController.restoreAdminDetails);
router.route("/admin/token").get(adminAuthController.refreshToken);
router.route("/admin/logout").delete(adminAuthController.handleLogout);


export default router;
