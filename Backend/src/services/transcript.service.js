import Transcript from "../models/transcript.model.js";
import fs from "fs/promises";
import mongoose from "mongoose";
import { generateTranscript } from "../services/transcript.engine.js";
import { generateSRT, generateVTT } from "../utils/subtitle.utils.js";

async function generateTranscriptService({ file, body, user }) {
  try {
    if (!file && !body.videoUrl) {
      throw new Error("Please upload a file or provide a video URL.");
    }
    if (file) {
   const transcriptData = await generateTranscript({
    file,
    videoUrl: null,
    language: body.language,
    prompt: body.prompt,
});

      const transcript = await Transcript.create({
        user: user.id,
        originalFileName: file.originalname,
        source: file.mimetype.startsWith("video/")
          ? "video-file"
          : "audio-file",
        provider: transcriptData.provider,
        language: transcriptData.language,
        languageProbability: transcriptData.languageProbability,
        transcript: transcriptData.text,
        segments: transcriptData.segments,
      });

      return {
        success: true,
        transcript,
      };
    }

    if (body.videoUrl) {
    const transcriptData = await generateTranscript({
    file: null,
    videoUrl: body.videoUrl,
    language: body.language,
    prompt: body.prompt,
});

      const transcript = await Transcript.create({
        user: user.id,
        originalFileName: body.videoUrl,
        source: "video-url",
        provider: transcriptData.provider,
        language: transcriptData.language,
        languageProbability: transcriptData.languageProbability,
        transcript: transcriptData.text,
        segments: transcriptData.segments,
      });

      return {
        success: true,
        transcript,
      };
    }
  } finally {
    if (file?.path) {
      await fs.unlink(file.path).catch(() => {});
    }
  }
}

async function getTranscriptHistoryService(user) {
  const transcripts = await Transcript.find({
    user: user.id,
  }).sort({
    createdAt: -1,
  });

  return {
    success: true,

    transcripts,
  };
}

async function getTranscriptByIdService(transcriptId, user) {
  const transcript = await Transcript.findOne({
    _id: transcriptId,

    user: user.id,
  });

  if (!transcript) {
    throw new Error("Transcript not found.");
  }

  return {
    success: true,

    transcript,
  };
}
async function deleteTranscriptService(transcriptId, user) {
  const transcript = await Transcript.findOne({
    _id: transcriptId,

    user: user.id,
  });

  if (!transcript) {
    throw new Error("Transcript not found.");
  }

  await transcript.deleteOne();

  return {
    success: true,

    message: "Transcript deleted successfully.",
  };
}

async function downloadTranscriptService({
  transcriptId,

  format,

  user,
}) {
  if (!mongoose.Types.ObjectId.isValid(transcriptId)) {
    throw new Error("Invalid transcript ID.");
  }

  const transcript = await Transcript.findOne({
    _id: transcriptId,

    user: user.id,
  });

  if (!transcript) {
    throw new Error("Transcript not found.");
  }

  switch (format) {
    case "txt":
      return {
        fileName: "transcript.txt",

        contentType: "text/plain",

        content: transcript.transcript,
      };
    case "srt":
      return {
        fileName: "transcript.srt",

        contentType: "application/x-subrip",

        content: generateSRT(transcript.segments),
      };
    case "vtt":
      return {
        fileName: "transcript.vtt",

        contentType: "text/vtt",

        content: generateVTT(transcript.segments),
      };
    default:
      throw new Error("Unsupported download format.");
  }
}

async function searchTranscriptService({ search, user }) {
  
  if (!search?.trim()) {
    throw new Error("Search query is required.");
  }
  const keyword = search.trim();

  const transcripts = await Transcript.find({
    user: user.id,

    $or: [
      {
        transcript: {
          $regex: keyword,
          $options: "i",
        },
      },

      {
        originalFileName: {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  }).sort({
    createdAt: -1,
  });

  return {
    success: true,

    count: transcripts.length,

    transcripts,
  };
}

export {
  generateTranscriptService,
  getTranscriptHistoryService,
  getTranscriptByIdService,
  deleteTranscriptService,
  downloadTranscriptService,
  generateSRT,
  generateVTT,
  searchTranscriptService,
};
