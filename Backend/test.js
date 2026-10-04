import { transcribe } from "./src/providers/local-whisper.provider.js";

const result = await transcribe("python/sample.mp3");

console.log(result);