import {
  generateTranscriptService,
  getTranscriptHistoryService,
  getTranscriptByIdService,
  deleteTranscriptService,
  downloadTranscriptService,
  searchTranscriptService
} from "../services/transcript.service.js";

async function generateTranscript(req, res, next) {
  console.log("✅ Controller Hit");
  

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

async function getTranscriptById(req, res, next) {
  try {
    const result = await getTranscriptByIdService(
      req.params.id,

      req.user,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
async function deleteTranscript(req, res, next) {
  try {
    const result = await deleteTranscriptService(req.params.id, req.user);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function downloadTranscript(req, res, next) {
  try {
    const result = await downloadTranscriptService({
      transcriptId: req.params.id,

      format: req.params.format,

      user: req.user,
    });

    res.set("Content-Type", result.contentType);

    res.set("Content-Disposition", `attachment; filename="${result.fileName}"`);

    return res.send(result.content);
  } catch (error) {
    next(error);
  }
}

async function searchTranscript(req, res, next) {

    try {

        const result =
            await searchTranscriptService({

                search: req.query.q,

                user: req.user,

            });

        return res.status(200).json(result);

    }

    catch (error) {

        next(error);

    }

}

export default {
  generateTranscript,
  getTranscriptHistory,
  getTranscriptById,
  deleteTranscript,
  downloadTranscript,
  searchTranscript,
};
