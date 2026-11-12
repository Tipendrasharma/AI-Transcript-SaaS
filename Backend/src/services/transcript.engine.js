import fs from "fs/promises";

import { getTranscriptProvider } from "../providers/provider.factory.js";
import { extractAudioFromVideo } from "../utils/ffmpeg.utils.js";
import { downloadVideo } from "../utils/audio-downloader.utils.js";

async function generateTranscript({ file, videoUrl, language, prompt }) {
  let audioPath = null;
  let downloadedAudioPath = null;
  let extractedAudioPath = null;

  try {
    if (videoUrl) {
      downloadedAudioPath = await downloadVideo(videoUrl);

      audioPath = downloadedAudioPath;
    } else if (file?.mimetype.startsWith("video/")) {
      extractedAudioPath = await extractAudioFromVideo(file.path);

      audioPath = extractedAudioPath;
    } else {
      audioPath = file.path;
    }

    const provider = getTranscriptProvider();


    const transcript = await provider.generateTranscript({
      audioPath,
      language,
      prompt,
    });

    return transcript;
  } finally {
    if (downloadedAudioPath) {
      await fs.unlink(downloadedAudioPath).catch(() => {});
    }

    if (extractedAudioPath) {
      await fs.unlink(extractedAudioPath).catch(() => {});
    }
  }
}

export { generateTranscript };
