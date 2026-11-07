import convertBullet from "../utils/description.js";
import HttpError from "../utils/httpError.js";

const MAX_DESCRIPTION_LENGTH = 2000;
const TYPES = ["description", "certificate"];

export const description = async (req, res) => {
  // "discription" is the field name the frontend has always sent; "description" is accepted too.
  const { discription, description: text = discription, type = "description" } = req.body || {};

  if (!TYPES.includes(type)) {
    throw new HttpError(400, "Type must be 'description' or 'certificate'.");
  }
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new HttpError(400, "Write a description first, then generate points.");
  }
  if (text.length > MAX_DESCRIPTION_LENGTH) {
    throw new HttpError(400, `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`);
  }

  const points = await convertBullet(text.trim(), type);
  res.json({ success: true, data: points });
};
