import fs from "fs/promises";

import { getTranscriptProvider } from "../providers/provider.factory.js";
import { extractAudioFromVideo } from "../utils/ffmpeg.utils.js";
import { downloadVideo } from "../utils/audio-downloader.utils.js";

async function generateTranscript({
    file,
    videoUrl
}) {

    let audioPath = null;
    let downloadedAudioPath = null;

    try {

        if (videoUrl) {

            downloadedAudioPath =
                await downloadVideo(videoUrl);

            audioPath = downloadedAudioPath;

        }

        else if (file.mimetype.startsWith("video/")) {

            audioPath =
                await extractAudioFromVideo(file.path);

        }

        else {

            audioPath = file.path;

        }

        const provider =
            getTranscriptProvider();

        const transcript =
            await provider.transcribe(audioPath);

        return transcript;

    }

    finally {

        if (downloadedAudioPath) {

            await fs.unlink(downloadedAudioPath)
                .catch(() => {});

        }

    }

}

export {
    generateTranscript
};