import { useContext, useState } from "react";
import Personal from "../../components/personal/personal";
import Skill from "../../components/skills/skills";
import "./resume.css";
import Certificate from "../../components/certificate/certificate";
import Education from "../../components/Education/education";
import { UserContext } from "../../context/userInfo";

const Resume = () => {
  const { userData, sendData, downloading, resetResume, points, certi } =
    useContext(UserContext);
  const [count, setCount] = useState(0);
  const step = [
    {
      name: "Personal",
      render: () => <Personal />,
    },
    {
      name: "Skill",
      render: () => <Skill />,
    },
    {
      name: "Certificate",
      render: () => <Certificate />,
    },
    {
      name: "Education",
      render: () => <Education />,
    },
  ];
  const handleNext = () => {
    if (count < step.length - 1) {
      setCount(count + 1);
    }
  };

  const handleBack = () => {
    if (count >= 1) {
      setCount(count - 1);
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear everything and start a new resume?")) {
      resetResume();
      setCount(0);
    }
  };
  return (
    <div className="resumeContainer">
      <button className="pdf" onClick={sendData} disabled={downloading}>
        {downloading ? "Preparing PDF..." : "Download"}
      </button>
      <button className="pdf reset" onClick={handleReset}>
        Start Over
      </button>
      <div className="formContainer">
        <div className="title">
          <h2>Enter Your Information</h2>
        </div>
        <div className="info">{step[count].render()}</div>
        <div className="btnContainer">
          <button onClick={handleBack}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>
      <div className="previewContainer">
        <div className="liveContainer" contenteditable="true">
          <div className="headContainer">
            <h2>
              {userData.firstName} {userData.lastName}
            </h2>
            <div className="personalInfo">
              <a href={`mailto:${userData.gmail}`} target="_blank">
                {userData.gmail ? "Gmail" : ""}
              </a>
              <h2>{userData.phoneNumber}</h2>
            </div>
            <div className="projectContainer">
              <a href={userData.gitHub} target="_blank">
                {userData.gitHub ? "GitHub" : ""}
              </a>
              <a href={userData.linkedin} target="_blank">
                {userData.linkedin ? "Linkedin" : ""}
              </a>
            </div>
          </div>
          <div className="skill">
            <h2>{userData.languages.length > 0 ? "Skills" : ""}</h2>
            <hr />
            <div className="userSkill">
              <h2>
                {userData.languages.length > 0 ? "Languages: " : ""}
                {userData.languages}
              </h2>
              <h2>
                {userData.technologies.length > 0 ? "Technologies: " : ""}
                {userData.technologies}
              </h2>
            </div>
          </div>

          {userData.aboutProject.some((item) => item.projectName) && (
            <>
              <div className="project">
                <h2>Projects</h2>
                <hr />
                <div className="userProject">
                  {userData.aboutProject.map((item, index) => {
                    return (
                      <div className="userProjectContainer" key={index}>
                        <h2>{item.projectName}</h2>
                        <ul>
                          {points[index]?.map((item, key) => {
                            return <li key={key}>{item.replace("-", "")}</li>;
                          })}
                        </ul>
                        <h2>
                          {item.techUsed ? "Tech Used: " : ""}
                          {item.techUsed}
                        </h2>
                        <a href={item.projectLink}>
                          {item.projectLink ? `${item.projectName}` : ""}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {userData.aboutCertificate.some((item) => item.certificateName) && (
            <>
              <div className="certificate">
                <h2>
                  {userData.aboutCertificate.length > 0 ? "Certificates" : ""}
                </h2>
                <hr />
                {userData.aboutCertificate.map((item, index) => {
                  return (
                    <div className="userCertificate" key={index}>
                      <h2>{item.certificateName}</h2>
                      {certi[index]?.length > 0 ? (
                        <ul>
                          {certi[index]?.map((point, key) => (
                            <li key={key}>{point.replace("-", "")}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: "gray", fontStyle: "italic" }}>
                          No points generated yet.
                        </p>
                      )}
                      <a href={item.certificateLink}>
                        {item.certificateLink ? "Certificate" : ""}
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {userData.aboutCollage.some((item) => item.collageName) && (
            <>
              <div className="education">
                <h2>Education</h2>
                <hr />
                <div className="userEducation">
                  {userData.aboutCollage.map((item, index) => {
                    return (
                      <div className="collageGrade" key={index}>
                        <div className="about">
                          <h2>{item.collageName}</h2>
                          <h2>{item.collageDegree}</h2>
                        </div>
                        <div className="mark">
                          <h2>{item.collageGrade}</h2>
                        </div>
                      </div>
                    );
                  })}
                  <div className="seniorSecondary">
                    <div className="seniorGrade">
                      <div className="aboutSenior">
                        <h2>{userData.seniorSecondaryName}</h2>
                        <h2>{userData.seniorSecondaryClass}</h2>
                      </div>
                      <div className="seniorMark">
                        <h2>
                          {userData.seniorSecondaryGrade}
                          {userData.seniorSecondaryGrade ? "%" : ""}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="higherSecondary">
                    <div className="higherGrade">
                      <div className="aboutHigh">
                        <h2>{userData.higherName}</h2>
                        <h2>{userData.higherClass}</h2>
                      </div>
                      <div className="HighMark">
                        <h2>
                          {userData.higherGrade}
                          {userData.higherGrade ? "%" : ""}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
