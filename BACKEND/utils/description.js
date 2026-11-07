import { OpenAI } from "openai/client.js";
import HttpError from "./httpError.js";

// Created on first use, so the server still starts (and PDF/ATS still work) without an OpenAI key.
// OPEN_API_KEY comes from BACKEND/.env, loaded once in server.js.
let openai = null;
const getClient = () => {
  if (!process.env.OPEN_API_KEY) {
    throw new HttpError(503, "AI points are not set up on this server (missing OpenAI key).", {
      expose: true,
    });
  }
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
  return openai;
};

// Turns OpenAI's errors into messages the user can act on.
const toHttpError = (err) => {
  if (err instanceof HttpError) return err;
  // Out of credits: OpenAI sends status 429 with type "insufficient_quota".
  if (
    err?.type === "insufficient_quota" ||
    err?.code === "insufficient_quota" ||
    err?.code === "credit_balance_exhausted"
  ) {
    return new HttpError(503, "The AI service is out of credits right now. You can still write points yourself.", {
      expose: true,
    });
  }
  if (err?.status === 401) {
    return new HttpError(503, "The AI service key is invalid. Ask the site owner to update it.", { expose: true });
  }
  if (err?.status === 429) {
    return new HttpError(429, "The AI service is busy. Please wait a moment and try again.");
  }
  if (err?.name === "APIConnectionTimeoutError" || err?.name === "APIConnectionError") {
    return new HttpError(504, "The AI service didn't respond. Please try again.", { expose: true });
  }
  return err;
};

const convertBullet = async (userDescription, type) => {
  const prompt =
    type === "description"
      ? "Convert these user description into 2-3 points for the resume according to the user description and also tell the use of technologies with it like if pdf making puppeteer is used like this"
      : "This is certificate description mention stuff like what i learn and important info like this in one paragaph don't make too large just 1-2 line";

  let completion;
  try {
    completion = await getClient().chat.completions.create(
      {
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: userDescription,
          },
        ],
        model: "gpt-4o",
      },
      { timeout: 30000, maxRetries: 1 },
    );
  } catch (err) {
    throw toHttpError(err);
  }

  const apiResponse = completion.choices[0]?.message?.content || "";
  const pointsArray = apiResponse
    .split(/\n+/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
  return pointsArray;
};

export default convertBullet;
