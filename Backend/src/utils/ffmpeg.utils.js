import { spawn } from "child_process";
import path from "path";

async function extractAudioFromVideo(videoPath) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      path.dirname(videoPath),

      `${path.parse(videoPath).name}.wav`,
    );

    const ffmpeg = spawn(
      process.env.FFMPEG_PATH,

      [
        "-i",

        videoPath,

        "-vn",

        "-acodec",

        "pcm_s16le",

        "-ar",

        "16000",

        "-ac",

        "1",

        outputPath,

        "-y",
      ],
    );

    let error = "";

    ffmpeg.stderr.on("data", (data) => {
      error += data.toString();
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(error));
      }
    });
  });
}

export { extractAudioFromVideo };
