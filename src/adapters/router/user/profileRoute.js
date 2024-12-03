import express from "express";
import isAuthUser from "../../middleware/userAuth.js";
import userController from "../../controller/userController.js";
import validateParams from "../../middleware/validateParams.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route("/").all(isAuthUser).get(userController.getUserDetails);

router
  .route("/")
  .all(isAuthUser)
  .post(upload.single("thumbnail"), userController.updateUserDetails);

router
  .route("/enrolled/:id/check")
  .get(validateParams, isAuthUser, userController.checkCourseEnrolled);

export default router;
