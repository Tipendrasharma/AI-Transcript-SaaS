import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

async function downloadVideo(videoUrl) {

    return new Promise(async (resolve, reject) => {

        try {

            const outputDirectory = path.join(
                process.cwd(),
                "downloads"
            );

            await fs.mkdir(outputDirectory, {
                recursive: true,
            });

            const fileId = crypto.randomUUID();

            const outputTemplate = path.join(
                outputDirectory,
                `${fileId}.%(ext)s`
            );

            const ytDlp = spawn(
                process.env.YTDLP_PATH,
                [
                    "-o",
                    outputTemplate,
                    videoUrl,
                ]
            );

            let error = "";

            ytDlp.stderr.on("data", (data) => {
                error += data.toString();
            });

            ytDlp.on("close", async (code) => {

                if (code !== 0) {
                    return reject(new Error(error));
                }

                const files = await fs.readdir(outputDirectory);

                const downloadedFile = files.find(file =>
                    file.startsWith(fileId)
                );

                if (!downloadedFile) {
                    return reject(
                        new Error("Downloaded file not found.")
                    );
                }

                resolve(
                    path.join(
                        outputDirectory,
                        downloadedFile
                    )
                );

            });

        } catch (err) {
            reject(err);
        }

    });

}

export {
    downloadVideo
};