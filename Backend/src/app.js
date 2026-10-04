import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth.routes.js";
import transcriptRouter from "./routes/transcript.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());


app.use("/api/auth", authRouter);

app.use("/api/transcript", transcriptRouter);

app.use(errorHandler);

export default app;