# Built-It Resume Builder: architecture

How the app is put together and how each feature works, from the button the user clicks to the response.

## Overview

```
FRONTEND (React 19 + Vite, React Router 7)          BACKEND (Node.js + Express 5)
┌───────────────────────────────────────┐           ┌──────────────────────────────────────────┐
│ pages/home      "/"        landing      │           │ server.js        express app, port 4000  │
│ pages/resume    "/resume"  4-step form  │  axios    │ routes/resume.js  /api/resume/*          │
│                            + live preview│ ───────► │   POST /description → AI bullet points   │
│ pages/ats       "/ats"     ATS checker  │  JSON     │   POST /generatepdf → PDF download       │
│                                         │ ◄─────── │   POST /ats         → ATS score          │
│ context/userInfo.jsx  all resume state  │           │ controllers/  request handling           │
│   + every API call                      │           │ utils/        OpenAI, Puppeteer, ATS     │
└───────────────────────────────────────┘           │ views/user.ejs   PDF template             │
                                                     └──────────────────────────────────────────┘
                                                        │ OpenAI API (gpt-4o)   │ headless Chrome
```

- **No database.** Resume data lives in React state (`UserContext`) while the user fills the form. It is sent to the backend only when a feature needs it.
- **All API calls live in the context** (`context/userInfo.jsx`), so pages and components never call axios themselves.

## The resume data (React context)

`UserContext` holds:

| State | Shape |
|---|---|
| `userData` | personal details, `languages` and `technologies` (arrays), `aboutProject[]`, `aboutCertificate[]`, `aboutCollage[]`, school details |
| `points` | AI bullet points, one array per project |
| `certi` | AI bullet points, one array per certificate |

The context also exposes the API functions: `generatePoints`, `sendData` (PDF) and `checkAtsScore`.

## Feature 1: AI bullet points

```
"Generate Points" button (project or certificate)
  → generatePoints(index, type)                         context
  → POST /api/resume/description { discription, type }
  → description controller → convertBullet()            utils/description.js
  → OpenAI chat completion (gpt-4o), system prompt chosen by type
  → response text split into lines, numbering stripped
  ← { success, data: [bullet, bullet, ...] }
  → stored in points[] or certi[] → shown in the live preview
```

The OpenAI key stays on the server (`OPEN_API_KEY` environment variable).

## Feature 2: PDF download

```
"Download" button
  → sendData()                                          context
  → POST /api/resume/generatepdf { userData, points, certi }   (responseType: "blob")
  → ejs.renderFile(views/user.ejs) → HTML string        utils/makepdf.js
  → puppeteer.launch() → page.setContent(html, networkidle0) → page.pdf({ format: "A4" })
  ← PDF bytes, Content-Type: application/pdf
  → Blob → object URL → hidden <a download="resume.pdf"> clicked → browser saves the file
```

## Feature 3: ATS score

```
"ATS" (home) or "Score" (navbar) → /ats page            pages/ats/ats.jsx
  user pastes a job description → "Check score"
  → checkAtsScore(jobDescription)                       context
  → POST /api/resume/ats { jobDescription, userData, points, certi }
  → atsScore controller: validates input                controllers/atsController.js
  → resumeToText(): flattens skills, projects, certificates and AI bullets into one text
  → analyzeResume(resumeText, jobDescription)           utils/ats.js
  ← { success, data: { score, matched[], missing[], totalKeywords } }
  → score, "Strong / Fair / Weak match", missing and found keywords as chips
```

**How the score is calculated (`utils/ats.js`):**

1. **Find keywords in the job description**, two kinds:
   - **Known skills** from a dictionary (`SKILLS`) of about 50 technologies, each with aliases, so `React.js`, `ReactJS` and `react` all count as `react`. **Weight 2.**
   - **Other important words** the job description repeats at least twice (for example "scalable"), ignoring common English words (`STOP_WORDS`) and known skills. Top 15. **Weight 1.**
2. **Check each keyword in the resume text**, as a whole word only: `java` doesn't match `javascript`, and `js` doesn't match the end of `node.js`.
3. **Score = matched weight ÷ total weight × 100**, rounded. Skills weigh more because they're what ATS filters and recruiters search for first.

**Validation (400 responses):**

| Case | Message |
|---|---|
| Job description missing, shorter than 30 or longer than 10,000 characters | "Paste a job description between 30 and 10000 characters." |
| No resume data sent | "Resume data is missing." |
| Resume has no text yet | "Your resume is empty. Fill in your skills and projects first." |
| No keywords found in the job description | "No keywords found in the job description. Paste the full description." |

The page also checks the 30-character minimum before calling the API, and shows the server's message if a request fails.

**Why keyword matching and not AI:** it's free, instant, gives the same answer every time, and every point of the score can be explained. Its limit: it matches words, not meaning ("built REST services" doesn't match "API development" unless both use a known alias). An embedding or LLM comparison would fix that later.

## Running locally

1. Copy `BACKEND/.env.example` to `BACKEND/.env` and add your OpenAI key.
2. Optionally copy `FRONTEND/.env.example` to `FRONTEND/.env`.
3. Start both:

```bash
cd BACKEND && npm install && node server.js
cd FRONTEND && npm install && npm run dev
```

## Configuration (environment variables)

| Variable | Where | Used for | Default |
|---|---|---|---|
| `OPEN_API_KEY` | `BACKEND/.env` | OpenAI calls for AI bullets | none (required for AI bullets) |
| `PORT` | `BACKEND/.env` | the port the server listens on | `4000` |
| `VITE_API_URL` | `FRONTEND/.env` | the backend address the browser calls | `http://localhost:4000` in development only |

- **The backend** loads `BACKEND/.env` once, at the top of `server.js` (`import "dotenv/config"`), before any other module reads `process.env`. Hosting platforms set `PORT` themselves.
- **The frontend** reads `import.meta.env.VITE_API_URL`. Vite only exposes variables that start with `VITE_`, and it writes their values **into the built JavaScript at build time**. So:
  - set `VITE_API_URL` in the hosting platform **before building**; changing it later needs a new build
  - never put a secret in a `VITE_` variable, because anyone can read it in the browser
- **Without `VITE_API_URL`,** a production build calls the site's own origin instead of `localhost`, so a missing setting fails visibly instead of quietly calling the visitor's own computer.
- `.env` files are git-ignored; the `.env.example` files are committed as templates.
