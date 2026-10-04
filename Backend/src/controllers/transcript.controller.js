import { generateTranscriptService } from "../services/transcript.service.js";
import { getTranscriptHistoryService } from "../services/transcript.service.js";

async function generateTranscript(req, res, next) {
  console.log("req.user =>", req.user);

  try {
    const result = await generateTranscriptService({
      file: req.file,

      body: req.body,

      user: req.user,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getTranscriptHistory(req, res, next) {
  try {
    const result = await getTranscriptHistoryService(req.user);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  generateTranscript,
  getTranscriptHistory,
};
