import { spawn } from "node:child_process";
import path from "node:path";

export async function transcribe(audioPath) {
  return new Promise((resolve, reject) => {

    const pythonProcess = spawn(
      process.env.PYTHON_PATH || "python",
      [
        path.join(process.cwd(), "python", "transcribe.py"),
        audioPath
      ]
    );

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });

    pythonProcess.on("close", (code) => {

      if (code !== 0) {
        return reject(new Error(stderr));
      }

      try {

        const transcript = JSON.parse(stdout);

        resolve(transcript);

      } catch {

        reject(new Error("Invalid JSON received from Python"));

      }

    });

  });
}