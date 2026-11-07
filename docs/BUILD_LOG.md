# Build log

Every change made to finish the Resume Builder, in order: what changed, why, and how it works. The full system picture is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Status

| # | Item | Status |
|---|---|---|
| 1 | ATS analyzer | ✅ Done |
| 2 | Wire up the dead "ATS" and "Score" buttons | ✅ Done (with #1) |
| 3 | API URL and port from environment variables | ✅ Done |
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

---

## 3. API URL and port from environment variables

**Branch:** `feat/env-config`

**Why:** the frontend called `http://localhost:4000` and the backend always used port `4000`, both hard-coded. A deployed site would try to reach `localhost`, which in a visitor's browser means **their own computer**, so nothing would work once deployed.

**What changed:**

| File | Change |
|---|---|
| `BACKEND/server.js` | Loads `.env` at the very top with `import "dotenv/config"`. Port is `Number(process.env.PORT) \|\| 4000`, and the startup log prints it. |
| `BACKEND/utils/description.js` | Removed its own `dotenv.config()`. The environment is now loaded in one place. |
| `BACKEND/.env.example` | **New** template: `OPEN_API_KEY`, `PORT`. |
| `FRONTEND/src/context/userInfo.jsx` | `url` comes from `import.meta.env.VITE_API_URL`, with `http://localhost:4000` only in development. |
| `FRONTEND/.env.example` | **New** template: `VITE_API_URL`. |
| `FRONTEND/.gitignore` | Now ignores `.env` (it only ignored `*.local` before). |

**How it works:** see "Configuration" in [ARCHITECTURE.md](ARCHITECTURE.md).

**Concepts:**
- **ES module imports run in order.** `import "dotenv/config"` must be the first import in `server.js`, so `process.env` is filled before `description.js` creates the OpenAI client.
- **Vite bakes `VITE_` variables into the build.** They are public: never store a secret in one.
- **`import.meta.env.DEV`** is `true` in `npm run dev` and `false` in a production build, so the localhost fallback disappears from production code.

**Tested:**
- The backend started with `PORT=4123` from a temporary `.env` and answered on port 4123 (the temporary file was deleted afterwards).
- `VITE_API_URL=https://api.example.test npx vite build` → the URL appears in the built JavaScript.
- A build without it → `localhost:4000` appears **0 times** in the built JavaScript.
- `git check-ignore`: both `.env` files are ignored; both `.env.example` files are not.

## 4. Reliability fixes: errors, PDF browser reuse, CORS, rate limits, draft saving

**Branch:** `feat/env-config` (same working branch)

**Why:** several requests could hang or leak resources, errors only went to `console.log`, the API accepted calls from any website, and AI points could attach to the wrong project.

**What changed:**

| File | Change |
|---|---|
| `BACKEND/server.js` | CORS limited to `CLIENT_URL`; one JSON error handler and a JSON 404; `trust proxy`; closes Chrome on shutdown; removed the unused `body-parser`. |
| `BACKEND/utils/makepdf.js` | One shared headless Chrome; each request opens a tab and closes it in `finally`, even on failure. |
| `BACKEND/controllers/resumeController.js` | Validates input; errors reach the error handler instead of hanging the request. |
| `BACKEND/utils/description.js` | OpenAI client created on first use (server starts without a key); clear messages for no credits, bad key, busy and timeout. |
| `BACKEND/controllers/aidescriptionController.js` | Validates type and description length. |
| `BACKEND/routes/resume.js` | Rate limits: 20 AI calls and 30 PDFs per IP per 15 minutes. |
| `BACKEND/utils/httpError.js` | **New**: an Error carrying an HTTP status. |
| `FRONTEND/src/context/userInfo.jsx` | AI points stored by index; list updates copy the changed item (no state mutation); draft saved in `localStorage`; `revokeObjectURL`; loading states; errors shown to the user. |
| `FRONTEND/src/components/*` | "Generating..." / "Preparing PDF..." states; delete buttons also remove that item's points; "Start Over" button. |
| `FRONTEND/src/components/personal/personal.jsx` | Import `./personal.css` (was `./Personal.css`: works on Windows, breaks the build on Linux/Vercel). |

**Tested (local, Edge via `PUPPETEER_EXECUTABLE_PATH`):**
- PDF: 200, `application/pdf`, text selectable; first request 1.8 s (Chrome launch), next ones 1.1 s (browser reused).
- PDF without Chrome installed: 500 JSON in 15 ms (before: the request never finished).
- AI with an account that has no credits: 503 "The AI service is out of credits right now…".
- Empty description 400, wrong type 400, bad JSON 400, unknown route 404.
- CORS: `http://localhost:5173` allowed, other origins get no CORS header.
- ATS: the 4-keyword example scores 57 (python, docker matched; sql, pipeline missing).
- UI: draft survives a page refresh; deleting project 2 removes its points; deleting the last project does nothing; Download builds a 20 KB PDF blob and revokes the URL.
