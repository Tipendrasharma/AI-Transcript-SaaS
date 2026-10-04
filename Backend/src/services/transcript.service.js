import Transcript from "../models/transcript.model.js";
import fs from "fs/promises";
import { generateTranscript } from "../services/transcript.engine.js";


async function generateTranscriptService({ file, body, user }) {

    try {

        if (!file && !body.videoUrl) {
            throw new Error("Please upload a file or provide a video URL.");
        }
if (file) {

    const transcriptData =
        await generateTranscript({
            file,
            videoUrl: null,
        });

    const transcript =
        await Transcript.create({
            user: user.id,
            originalFileName: file.originalname,
            source: file.mimetype.startsWith("video/")
                ? "video-file"
                : "audio-file",
            provider: transcriptData.provider,
            language: transcriptData.language,
            languageProbability:
                transcriptData.languageProbability,
            transcript: transcriptData.text,
            segments: transcriptData.segments,
        });

    return {
        success: true,
        transcript,
    };

}

if (body.videoUrl) {

    const transcriptData =
        await generateTranscript({
            file: null,
            videoUrl: body.videoUrl,
        });

    const transcript =
        await Transcript.create({
            user: user.id,
            originalFileName: body.videoUrl,
            source: "video-url",
            provider: transcriptData.provider,
            language: transcriptData.language,
            languageProbability:
                transcriptData.languageProbability,
            transcript: transcriptData.text,
            segments: transcriptData.segments,
        });

    return {
        success: true,
        transcript,
    };

}

        }

     finally {

        if (file?.path) {

            await fs.unlink(file.path)
                .catch(() => {});

        }

    }

}



async function getTranscriptHistoryService(user) {

    const transcripts = await Transcript
        .find({
            user: user.id
        })
        .sort({
            createdAt: -1
        });

    return {

        success: true,

        transcripts,

    };

}


export { generateTranscriptService ,getTranscriptHistoryService};