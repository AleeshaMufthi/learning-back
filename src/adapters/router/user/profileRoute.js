import express from 'express'
import isAuthUser from "../../middleware/userAuth.js";
import userController from "../../controller/userController.js";

const router = express.Router();

router.route('/')
      .all(isAuthUser)
      .get(userController.getUserDetails)
      .post(userController.updateUserDetails)

export default router   