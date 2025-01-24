import reviewController from "../../controller/reviewController.js";
import isAuthUser from "../../middleware/userAuth.js";
import express from "express";

const router = express.Router();

router.route("/create/:courseId").all(isAuthUser).post(reviewController.addReview);

router.route("/:courseId").all(isAuthUser).get(reviewController.getReviews);

export default router;