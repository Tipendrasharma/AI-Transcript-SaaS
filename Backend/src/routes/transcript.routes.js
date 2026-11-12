import express from "express";

import upload from "../middleware/upload.middleware.js";
import transcriptController from "../controllers/transcript.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",authenticate,upload.single("media"),transcriptController.generateTranscript,);

router.get("/", authenticate, transcriptController.getTranscriptHistory);
router.get("/search", authenticate, transcriptController.searchTranscript);

router.get("/:id", authenticate, transcriptController.getTranscriptById);
router.delete("/:id", authenticate, transcriptController.deleteTranscript);
router.get(
  "/:id/download/:format",
  authenticate,
  transcriptController.downloadTranscript,
);

export default router;
