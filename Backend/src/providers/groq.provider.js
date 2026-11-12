import fs from "fs";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateTranscript = async ({
  audioPath,
  language,
  prompt,
}) => {
  if (!audioPath) {
    throw new Error("Audio path is required.");
  }

  try {


    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: process.env.GROQ_TRANSCRIPT_MODEL,
      language,
      prompt,
      response_format: "verbose_json",
      temperature: 0,
      timestamp_granularities: ["segment"],
    });

    return {
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      segments: transcription.segments,
      provider: "groq",
      model: process.env.GROQ_TRANSCRIPT_MODEL,
      metadata: {
        requestId: transcription?.x_groq?.id || null,
      },
    };
  } catch (error) {
    console.error("Groq Provider Error:", error);

    if (error.status === 401) {
      throw new Error("Invalid Groq API Key.");
    }

    if (error.status === 429) {
      throw new Error("Groq rate limit exceeded.");
    }

    if (error.status === 413) {
      throw new Error("Audio file is too large.");
    }

    throw new Error(error.message || "Failed to generate transcript.");
  }
};

export default {
  generateTranscript,
};