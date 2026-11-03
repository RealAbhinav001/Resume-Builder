import { analyzeResume, resumeToText } from "../utils/ats.js";

const MIN_JD_LENGTH = 30;
const MAX_JD_LENGTH = 10000;

export const atsScore = (req, res) => {
  const { jobDescription, userData, points, certi } = req.body || {};

  if (
    typeof jobDescription !== "string" ||
    jobDescription.trim().length < MIN_JD_LENGTH ||
    jobDescription.length > MAX_JD_LENGTH
  ) {
    return res.status(400).json({
      success: false,
      message: `Paste a job description between ${MIN_JD_LENGTH} and ${MAX_JD_LENGTH} characters.`,
    });
  }
  if (!userData || typeof userData !== "object") {
    return res.status(400).json({ success: false, message: "Resume data is missing." });
  }

  const resumeText = resumeToText({ userData, points, certi });
  if (resumeText.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Your resume is empty. Fill in your skills and projects first.",
    });
  }

  const result = analyzeResume(resumeText, jobDescription);
  if (result.totalKeywords === 0) {
    return res.status(400).json({
      success: false,
      message: "No keywords found in the job description. Paste the full description.",
    });
  }

  res.json({ success: true, data: result });
};
