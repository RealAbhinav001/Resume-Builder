import "./main.css";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Fill in four short steps",
    text: "Your details, skills and projects, certificates and education. The preview updates as you type.",
  },
  {
    title: "Let AI write your bullet points",
    text: "Describe a project in your own words. GPT-4o turns it into 2–3 clear resume points that name the technologies.",
  },
  {
    title: "Download a clean PDF",
    text: "A single-column, text-based A4 resume, so applicant tracking systems can read every word.",
  },
  {
    title: "Match it to a job",
    text: "Paste a job description to get a score out of 100 and the keywords your resume is missing.",
  },
];

const Main = () => {
  return (
    <main className="landing">
      <section className="hero">
        <div className="heroCopy">
          <h1>Turn your projects into a resume recruiters can actually read.</h1>
          <p className="heroLead">
            Write your projects in plain words, let AI turn them into strong bullet points,
            download an ATS-friendly PDF, and check how well it matches the job you want.
          </p>
          <div className="heroActions">
            <Link to="/resume" className="btn btn-primary btn-large">
              Build my resume
            </Link>
            <Link to="/ats" className="btn btn-secondary btn-large">
              Check my ATS score
            </Link>
          </div>
          <p className="heroNote">Free to use. No sign-up. Your draft stays in your browser.</p>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="sheet">
            <p className="sheetName">Priya Sharma</p>
            <p className="sheetMeta">B.Tech Computer Science, 2026</p>
            <p className="sheetHeading">Skills</p>
            <p className="sheetLine">
              <mark>JavaScript</mark>, <mark>React</mark>, <mark>Node.js</mark>, <mark>MongoDB</mark>, Git
            </p>
            <p className="sheetHeading">Projects</p>
            <p className="sheetProject">Campus Events Portal</p>
            <ul className="sheetList">
              <li>
                Built a <mark>REST API</mark> in <mark>Express</mark> serving 40+ endpoints for event sign-ups.
              </li>
              <li>
                Added real-time seat updates with <mark>Socket.IO</mark>, used by 300+ students.
              </li>
            </ul>
            <p className="sheetProject">Expense Splitter</p>
            <ul className="sheetList">
              <li>
                Designed a <mark>React</mark> app that settles group bills in the fewest payments.
              </li>
            </ul>
            <div className="sheetFade" />
          </div>
          <div className="scoreTag">
            <span className="scoreTagNumber">82</span>
            <span className="scoreTagText">
              ATS match
              <br />
              <strong>9 of 11 keywords</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="how" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol className="howList">
          {steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
};

export default Main;
