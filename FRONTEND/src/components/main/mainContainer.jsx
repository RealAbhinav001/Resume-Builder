import "./main.css";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="main-container">
      <div className="head">
        <h1>Build Preview Check</h1>
        <p>
          Generate stunning, job-ready resumes with AI. Preview live, download
          as PDF, and boost your ATS score.
        </p>
      </div>
      <div className="cta-button">
        <Link to="/resume">
          <button>Resume</button>
        </Link>
        <Link to="/ats">
          <button>ATS</button>
        </Link>
      </div>
    </div>
  );
};

export default Main;
