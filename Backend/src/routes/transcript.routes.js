import express from "express";

import upload from "../middleware/upload.middleware.js";
import transcriptController from "../controllers/transcript.controller.js";
import {authenticate} from "../middleware/auth.middleware.js"; // Baad me add karenge

const router = express.Router();

router.post(
    "/",
     authenticate,
    upload.single("media"),
    transcriptController.generateTranscript
);

router.get(
    "/",
    authenticate,
    transcriptController.getTranscriptHistory
);

export default router;