import express from "express";
import tutorController from "../../controller/tutorController.js";
import isAuthTutor from "../../middleware/tutorAuth.js";

const router = express.Router();

router.route("/")
      .all(isAuthTutor)
      .get(tutorController.getTutorDetails)
      .post(tutorController.updateTutorDetails)
router.route("/top")
      .get(tutorController.getTopTutors)

export default router