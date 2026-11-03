import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userInfo";
import "./ats.css";

const scoreLabel = (score) => {
  if (score >= 75) return "Strong match";
  if (score >= 50) return "Fair match";
  return "Weak match";
};

const Ats = () => {
  const { checkAtsScore } = useContext(UserContext);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (jobDescription.trim().length < 30) {
      setError("Paste the full job description first (at least 30 characters).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setResult(await checkAtsScore(jobDescription));
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="atsContainer">
      <div className="atsHeader">
        <Link to="/" className="atsBrand">
          Built-It
        </Link>
        <Link to="/resume">
          <button className="atsSecondary">Edit resume</button>
        </Link>
      </div>

      <div className="atsBody">
        <section className="atsCard">
          <h2>Check your ATS score</h2>
          <p className="atsHint">
            Paste a job description. Your resume from the builder is compared
            with it, keyword by keyword.
          </p>
          <label htmlFor="jobDescription" className="atsLabel">
            Job description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (error) setError("");
            }}
            placeholder="We're looking for a Full Stack Developer with React, Node.js and MongoDB..."
            rows={12}
          />
          {error && <p className="atsError">{error}</p>}
          <button className="atsPrimary" onClick={handleCheck} disabled={loading}>
            {loading ? "Checking..." : "Check score"}
          </button>
        </section>

        <section className="atsCard atsResult">
          {!result ? (
            <div className="atsEmpty">
              <h2>Your score appears here</h2>
              <p className="atsHint">
                Fill in your skills and projects in the builder first, then
                paste a job description and press Check score.
              </p>
            </div>
          ) : (
            <>
              <div className="atsScore">
                <span className="atsScoreNumber">{result.score}</span>
                <span className="atsScoreOutOf">/ 100</span>
              </div>
              <p className="atsScoreLabel">
                {scoreLabel(result.score)}: {result.matched.length} of{" "}
                {result.totalKeywords} keywords found
              </p>

              <h3>Missing keywords</h3>
              {result.missing.length === 0 ? (
                <p className="atsHint">None. Every keyword is in your resume.</p>
              ) : (
                <>
                  <p className="atsHint">
                    Add the ones you really know to your skills or project
                    bullets.
                  </p>
                  <ul className="atsChips">
                    {result.missing.map((keyword) => (
                      <li key={keyword} className="atsChip atsChipMissing">
                        {keyword}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h3>Found in your resume</h3>
              {result.matched.length === 0 ? (
                <p className="atsHint">No keywords matched yet.</p>
              ) : (
                <ul className="atsChips">
                  {result.matched.map((keyword) => (
                    <li key={keyword} className="atsChip atsChipFound">
                      {keyword}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Ats;
