function generateSRT(segments) {
  return segments
    .map((segment, index) => {
      return `${index + 1}
${formatSRTTime(segment.start)} --> ${formatSRTTime(segment.end)}
${segment.text}
`;
    })
    .join("\n");
}

function generateVTT(segments) {
  const cues = segments
    .map((segment) => {
      return `${formatVTTTime(segment.start)} --> ${formatVTTTime(segment.end)}
${segment.text}
`;
    })
    .join("\n");

  return `WEBVTT

${cues}`;
}

function formatSRTTime(seconds) {
  const totalMilliseconds = Math.floor(seconds * 1000);

  const hours = Math.floor(totalMilliseconds / 3600000);

  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);

  const secs = Math.floor((totalMilliseconds % 60000) / 1000);

  const milliseconds = totalMilliseconds % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

function formatVTTTime(seconds) {
  const totalMilliseconds = Math.floor(seconds * 1000);

  const hours = Math.floor(totalMilliseconds / 3600000);

  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);

  const secs = Math.floor((totalMilliseconds % 60000) / 1000);

  const milliseconds = totalMilliseconds % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}

export { generateSRT, generateVTT };
