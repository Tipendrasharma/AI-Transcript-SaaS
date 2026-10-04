import sys
import json
from faster_whisper import WhisperModel

# Load Whisper Model
model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

# Audio path from Node.js
audio_path = sys.argv[1]

segments, info = model.transcribe(
    audio_path,
    beam_size=5
)

transcript = []

full_text = ""

for segment in segments:

    transcript.append({
        "start": segment.start,
        "end": segment.end,
        "text": segment.text.strip()
    })

    full_text += segment.text.strip() + " "

response = {
    "success": True,
    "provider": "local-whisper",
    "language": info.language,
    "languageProbability": info.language_probability,
    "text": full_text.strip(),
    "segments": transcript
}

print(json.dumps(response))