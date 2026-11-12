import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(null, uniqueName + extension);
  },
});

const allowedMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",

  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
];

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only MP4, MOV, MKV, WEBM, MP3, WAV and M4A files are allowed.",
      ),
    );
  }
}

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 1024 * 1024 * 1024,

    files: 1,
  },
});

export default upload;
