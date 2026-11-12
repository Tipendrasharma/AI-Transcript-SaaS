import localWhisperProvider from "./local-whisper.provider.js";
import groqProvider from "./groq.provider.js";

const providers = {
    local: localWhisperProvider,
    groq: groqProvider,
};

export function getTranscriptProvider() {

    const providerName =
        process.env.TRANSCRIPT_PROVIDER || "local";

    const provider = providers[providerName];

    if (!provider) {
        throw new Error(
            `Unsupported transcript provider: ${providerName}`
        );
    }

    return provider;
}