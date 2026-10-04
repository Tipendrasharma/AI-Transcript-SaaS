import mongoose from "mongoose";

const transcriptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        originalFileName: {
            type: String,
            required: true,
            trim: true,
        },

        source: {
            type: String,
            enum: ["audio-file", "video-file", "video-url"],
            required: true,
        },

        provider: {
            type: String,
            required: true,
        },

        language: {
            type: String,
            required: true,
        },

        languageProbability: {
            type: Number,
        },

        transcript: {
            type: String,
            required: true,
        },

        segments: [
            {
                start: Number,
                end: Number,
                text: String,
            },
        ],

        status: {
            type: String,
            enum: ["processing", "completed", "failed"],
            default: "completed",
        },
    },
    {
        timestamps: true,
    }
);

const Transcript = mongoose.model("Transcript", transcriptSchema);

export default Transcript;