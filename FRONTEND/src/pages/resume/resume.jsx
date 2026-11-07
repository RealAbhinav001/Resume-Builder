import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Personal from "../../components/personal/personal";
import Skill from "../../components/skills/skills";
import "./resume.css";
import Certificate from "../../components/certificate/certificate";
import Education from "../../components/Education/education";
import { UserContext } from "../../context/userInfo";

const steps = [
  {
    name: "Personal",
    title: "Your details",
    hint: "How recruiters will contact you.",
    Component: Personal,
  },
  {
    name: "Skills & projects",
    title: "Skills and projects",
    hint: "Describe each project in your own words, then let AI write the bullet points.",
    Component: Skill,
  },
  {
    name: "Certificates",
    title: "Certificates",
    hint: "Courses and certifications that support the role you want.",
    Component: Certificate,
  },
  {
    name: "Education",
    title: "Education",
    hint: "College first, then school.",
    Component: Education,
  },
];

// The skills inputs store arrays; join them for display and drop empty items.
const listText = (list) =>
  list
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");

const Resume = () => {
  const { userData, sendData, downloading, resetResume, points, certi } =
    useContext(UserContext);
  const [count, setCount] = useState(0);
  const current = steps[count];
  const StepForm = current.Component;
  const isLast = count === steps.length - 1;

  const handleNext = () => {
    if (!isLast) setCount(count + 1);
  };

  const handleBack = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleReset = () => {
    if (window.confirm("Clear everything and start a new resume?")) {
      resetResume();
      setCount(0);
    }
  };

  const fullName = `${userData.firstName} ${userData.lastName}`.trim();
  const languages = listText(userData.languages);
  const technologies = listText(userData.technologies);
  const hasProjects = userData.aboutProject.some((item) => item.projectName);
  const hasCertificates = userData.aboutCertificate.some((item) => item.certificateName);
  const hasCollege = userData.aboutCollage.some((item) => item.collageName);
  const hasSchool = userData.seniorSecondaryName || userData.higherName;
  const isEmpty =
    !fullName && !languages && !technologies && !hasProjects && !hasCertificates && !hasCollege && !hasSchool;

  return (
    <div className="builder">
      <header className="topbar">
        <Link to="/" className="brand">
          Built-It
        </Link>
        <div className="topbar-actions">
          <Link to="/ats" className="btn btn-ghost btn-small hideOnPhone">
            Check ATS score
          </Link>
          <button className="btn btn-secondary btn-small" onClick={handleReset}>
            Start over
          </button>
          <button className="btn btn-primary btn-small" onClick={sendData} disabled={downloading}>
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </button>
        </div>
      </header>

      <div className="builderBody">
        <section className="editor" aria-labelledby="step-title">
          <nav className="stepper" aria-label="Resume sections">
            {steps.map((step, index) => (
              <button
                key={step.name}
                type="button"
                className={`stepTab ${index === count ? "isActive" : ""} ${index < count ? "isDone" : ""}`}
                aria-current={index === count ? "step" : undefined}
                onClick={() => setCount(index)}
              >
                <span className="stepNumber">{index + 1}</span>
                <span className="stepName">{step.name}</span>
              </button>
            ))}
          </nav>

          <div className="editorHead">
            <h1 id="step-title">{current.title}</h1>
            <p>{current.hint}</p>
          </div>

          <div className="editorForm">
            <StepForm />
          </div>

          <div className="editorNav">
            <button className="btn btn-secondary" onClick={handleBack} disabled={count === 0}>
              Back
            </button>
            <span className="editorProgress">
              Step {count + 1} of {steps.length}
            </span>
            {isLast ? (
              <button className="btn btn-primary" onClick={sendData} disabled={downloading}>
                {downloading ? "Preparing PDF..." : "Download PDF"}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                Next: {steps[count + 1].name}
              </button>
            )}
          </div>
        </section>

        <section className="previewPane" aria-label="Live preview">
          <p className="previewLabel">Live preview</p>
          <div className="paper">
            {isEmpty ? (
              <div className="paperEmpty">
                <p>Your resume appears here as you type.</p>
                <p>Start with your name on the left.</p>
              </div>
            ) : (
              <>
                <div className="rHead">
                  {fullName && <h2 className="rName">{fullName}</h2>}
                  <p className="rContact">
                    {userData.gmail && <a href={`mailto:${userData.gmail}`}>{userData.gmail}</a>}
                    {userData.phoneNumber && <span>{userData.phoneNumber}</span>}
                    {userData.gitHub && (
                      <a href={userData.gitHub} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {userData.linkedin && (
                      <a href={userData.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    )}
                  </p>
                </div>

                {(languages || technologies) && (
                  <div className="rSection">
                    <h3>Skills</h3>
                    {languages && (
                      <p>
                        <strong>Languages:</strong> {languages}
                      </p>
                    )}
                    {technologies && (
                      <p>
                        <strong>Technologies:</strong> {technologies}
                      </p>
                    )}
                  </div>
                )}

                {hasProjects && (
                  <div className="rSection">
                    <h3>Projects</h3>
                    {userData.aboutProject.map((item, index) =>
                      item.projectName ? (
                        <div className="rItem" key={index}>
                          <p className="rItemTitle">
                            {item.projectName}
                            {item.projectLink && (
                              <a href={item.projectLink} target="_blank" rel="noreferrer">
                                Link
                              </a>
                            )}
                          </p>
                          {points[index]?.length > 0 ? (
                            <ul>
                              {points[index].map((point, key) => (
                                <li key={key}>{point.replace(/^[-•*]\s*/, "")}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="rPending">Press "Generate Points" to add bullet points.</p>
                          )}
                          {item.techUsed && (
                            <p>
                              <strong>Tech used:</strong> {item.techUsed}
                            </p>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                {hasCertificates && (
                  <div className="rSection">
                    <h3>Certificates</h3>
                    {userData.aboutCertificate.map((item, index) =>
                      item.certificateName ? (
                        <div className="rItem" key={index}>
                          <p className="rItemTitle">
                            {item.certificateName}
                            {item.certificateLink && (
                              <a href={item.certificateLink} target="_blank" rel="noreferrer">
                                Certificate
                              </a>
                            )}
                          </p>
                          {certi[index]?.length > 0 ? (
                            certi[index].map((point, key) => <p key={key}>{point.replace(/^[-•*]\s*/, "")}</p>)
                          ) : (
                            <p className="rPending">Press "Generate Description" to add a short description.</p>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                {(hasCollege || hasSchool) && (
                  <div className="rSection">
                    <h3>Education</h3>
                    {userData.aboutCollage.map((item, index) =>
                      item.collageName ? (
                        <div className="rRow" key={index}>
                          <div>
                            <p className="rItemTitle">{item.collageName}</p>
                            {item.collageDegree && <p>{item.collageDegree}</p>}
                          </div>
                          {item.collageGrade && <p className="rGrade">{item.collageGrade}</p>}
                        </div>
                      ) : null
                    )}
                    {userData.seniorSecondaryName && (
                      <div className="rRow">
                        <div>
                          <p className="rItemTitle">{userData.seniorSecondaryName}</p>
                          {userData.seniorSecondaryClass && <p>Class {userData.seniorSecondaryClass}</p>}
                        </div>
                        {userData.seniorSecondaryGrade && <p className="rGrade">{userData.seniorSecondaryGrade}%</p>}
                      </div>
                    )}
                    {userData.higherName && (
                      <div className="rRow">
                        <div>
                          <p className="rItemTitle">{userData.higherName}</p>
                          {userData.higherClass && <p>Class {userData.higherClass}</p>}
                        </div>
                        {userData.higherGrade && <p className="rGrade">{userData.higherGrade}%</p>}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;
