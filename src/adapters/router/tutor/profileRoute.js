import express from "express";
import tutorController from "../../controller/tutorController.js";
import isAuthTutor from "../../middleware/tutorAuth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route("/")
      .all(isAuthTutor)
      .get(tutorController.getTutorDetails)

router.route("/")
      .all(isAuthTutor)
      .post(upload.single("thumbnail"), tutorController.updateTutorDetails);

router.route("/top")
      .get(tutorController.getTopTutors)

router.route("/all")
      .get(tutorController.getAllTutors)

export default router