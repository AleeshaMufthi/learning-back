import express from "express";
import lessonController from '../../controller/lessonController.js'
import validateParams from '../../middleware/validateParams.js'

const router = express.Router();

router.route("/:id")
      .get(validateParams, lessonController.getLesson);

export default router