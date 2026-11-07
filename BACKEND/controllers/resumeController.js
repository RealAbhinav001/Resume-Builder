import { generatePdf } from "../utils/makepdf.js";
import HttpError from "../utils/httpError.js";

export const getUserData = async (req, res) => {
  const { userData, points = [], certi = [] } = req.body || {};

  if (!userData || typeof userData !== "object") {
    throw new HttpError(400, "Resume data is missing.");
  }
  if (!Array.isArray(points) || !Array.isArray(certi)) {
    throw new HttpError(400, "Points and certificate descriptions must be lists.");
  }

  // Any failure here goes to the error handler in server.js, which always responds.
  const pdf = await generatePdf(userData, points, certi);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=resume.pdf",
  });
  res.send(Buffer.from(pdf));
};
