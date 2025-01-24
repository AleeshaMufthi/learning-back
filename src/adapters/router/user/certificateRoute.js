import certificateController from "../../controller/certificateController.js";
import isAuthUser from "../../middleware/userAuth.js";
import express from "express";

const router = express.Router();

router.route("/create").all(isAuthUser).post(certificateController.handleCreateCertificate);

router.route("/:userId").all(isAuthUser).get(certificateController.getCertificate);

export default router;