import express from "express";
import { getUserData } from "../controllers/resumeController.js";
import { description } from "../controllers/aidescriptionController.js";
import { atsScore } from "../controllers/atsController.js";

const resumeRouter = express.Router();

resumeRouter.post("/generatepdf", getUserData);
resumeRouter.post("/description", description);
resumeRouter.post("/ats", atsScore);

export default resumeRouter;
