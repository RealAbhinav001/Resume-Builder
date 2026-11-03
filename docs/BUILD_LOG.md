# Build log

Every change made to finish the Resume Builder, in order: what changed, why, and how it works. The full system picture is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Status

| # | Item | Status |
|---|---|---|
| 1 | ATS analyzer | ✅ Done |
| 2 | Wire up the dead "ATS" and "Score" buttons | ✅ Done (with #1) |
| 3 | API URL and port from environment variables | ⬜ |
| 4 | Deploy the backend (Puppeteer-compatible) | ⬜ |
| 5 | Deploy the frontend on Vercel | ⬜ |
| 6 | Error responses on the PDF and AI routes | ⬜ |
| 7 | Validate inputs on all routes | ⬜ |
| 8 | Rate limit the AI route | ⬜ |
| 9 | Restrict CORS to the frontend | ⬜ |
| 10 | Reuse one Puppeteer browser | ⬜ |
| 11 | Fix `.gitignore` and remove the committed `BACKEND/node_modules` | ⬜ |
| 12 | Clean up dependencies | ⬜ |
| 13 | Show errors in the UI, revoke the download URL | ⬜ |
| 15 | Keep form data on refresh | ⬜ |
| 16 | Edit AI bullets before the PDF | ⬜ |
| 18 | Better AI prompts | ⬜ |
| 19 | Fix typos in names and the UI | ⬜ |
| 20 | README | ⬜ |
| 22–26 | Website layout: responsive design, `100vh`, padding, % buttons, absolute Download button | ⬜ |
| 27–28 | PDF layout: `vw` font sizes, print rules | ⬜ |

(#14 was merged into #27. #17, a live preview, already exists on the resume page. #21: work happens in the cloned GitHub repo.)

---

## 1. ATS analyzer (and #2, the dead buttons)

**Branch:** `feat/ats-analyzer`

**Why:** the resume claimed an ATS analyzer, but only an empty "ATS" button existed.

**What changed:**

| File | Change |
|---|---|
| `BACKEND/utils/ats.js` | **New.** The scoring logic: skill dictionary with aliases, stop words, whole-word matching, weighted score. `resumeToText()` flattens the resume data. |
| `BACKEND/controllers/atsController.js` | **New.** Validates the request, builds the resume text, runs the analysis, returns `{ score, matched, missing, totalKeywords }` or a 400 with a clear message. |
| `BACKEND/routes/resume.js` | Added `POST /api/resume/ats`. |
| `FRONTEND/src/pages/ats/ats.jsx` + `ats.css` | **New page** at `/ats`: job description box, "Check score", the score with a label, and missing and found keywords as chips. Loading, error and empty states. Works at phone width. |
| `FRONTEND/src/context/userInfo.jsx` | Added `checkAtsScore(jobDescription)`, which sends the current resume with the job description and turns server errors into a readable message. |
| `FRONTEND/src/App.jsx` | Added the `/ats` route. |
| `FRONTEND/src/components/main/mainContainer.jsx`, `navBar/navbar.jsx` | The "ATS" and "Score" buttons now link to `/ats` (fixes #2). |

**How it works:** see "Feature 3: ATS score" in [ARCHITECTURE.md](ARCHITECTURE.md).

**Bugs found while testing, and fixed:**
- `js` (an alias for JavaScript) matched the end of `Node.js`, so a job description mentioning only Node counted JavaScript as a keyword. Fixed by treating a dot before a term as part of the word.
- The job description box was two lines tall. `skills.css` styles **every** `textarea` in the app with `height: 50px`, because Vite loads all CSS globally. Fixed with an explicit height on the ATS page.

**Tested:**
- Unit checks: `java` ≠ `javascript`; `js` ≠ `node.js`; `C++` and `C#` match; `Next.js` / `React.js` aliases.
- API: a short job description → 400 with a message; valid input → score and keywords.
- In the browser: home "ATS" button → `/ats` → a sample job description gave **42 / 100**, with 5 of 12 keywords found and the missing ones shown. Checked at desktop and phone width.

**Known limits:**
- Matching is by words, not meaning.
- The skill dictionary has about 50 technologies, so less common skills only count if the job description repeats them.
- Resume data is lost if the page is reloaded (#15), so open `/ats` with the in-app buttons after filling the form, not by reloading the URL.
