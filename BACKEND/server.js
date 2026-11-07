// Load BACKEND/.env first, so every module below can read process.env.
import "dotenv/config";
import express from "express";
import cors from "cors";
import resumeRouter from "./routes/resume.js";
import { closeBrowser } from "./utils/makepdf.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

// Only the frontend may call this API. CLIENT_URL can hold several origins, comma separated.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Hosting platforms like Render sit behind a proxy; this makes req.ip the real client IP for rate limiting.
app.set("trust proxy", 1);
app.set("view engine", "ejs");

//MiddleWare
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "200kb" }));
app.use("/api/resume", resumeRouter);

app.get("/", (req, res) => {
  res.send("Working");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// One place that turns every error into a JSON response, so no request is left hanging.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body is not valid JSON." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large." });
  }
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 && !err.expose ? "Something went wrong. Please try again." : err.message,
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Close the shared headless Chrome when the server stops.
const shutdown = async () => {
  await closeBrowser();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
