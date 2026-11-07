import express from "express";
import rateLimit from "express-rate-limit";
import { getUserData } from "../controllers/resumeController.js";
import { description } from "../controllers/aidescriptionController.js";
import { atsScore } from "../controllers/atsController.js";

const resumeRouter = express.Router();

const tooMany = (message) => (req, res) => res.status(429).json({ success: false, message });

// Every AI call costs money, so each IP gets a small budget.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooMany("Too many AI requests. Please try again in a few minutes."),
});

// PDF generation runs Chrome, so it is limited too.
const pdfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooMany("Too many downloads. Please try again in a few minutes."),
});

resumeRouter.post("/generatepdf", pdfLimiter, getUserData);
resumeRouter.post("/description", aiLimiter, description);
resumeRouter.post("/ats", atsScore);

export default resumeRouter;
