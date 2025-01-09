import express from "express";
import lessonController from '../../controller/lessonController.js'
import validateParams from '../../middleware/validateParams.js'
import isAuthUser from "../../middleware/userAuth.js";
import rbacAuth from "../../middleware/rbacAuth.js";

const router = express.Router();

router.route("/:id").all(rbacAuth(["tutor", "user"]))
      .get(validateParams, lessonController.getLesson);

// router.route("/video")
//       .get(isAuthUser, lessonController.getLessonVideo);

export default router