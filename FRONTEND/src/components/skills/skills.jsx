import "./skills.css";
import { useContext } from "react";
import { UserContext } from "../../context/userInfo";

const Skill = () => {
  const {
    userData,
    handleChange,
    handleProjectChange,
    setUserData,
    generatePoints,
    generating,
    removeLastProject,
  } = useContext(UserContext);

  const addProject = () => {
    const newProject = {
      projectName: "",
      projectDescription: "",
      techUsed: "",
      projectLink: "",
    };
    setUserData((prev) => ({
      ...prev,
      aboutProject: [...prev.aboutProject, newProject],
    }));
  };

  return (
    <div className="formStack">
      <label className="field">
        <span>Programming languages</span>
        <input
          name="languages"
          value={userData.languages.join(",")}
          type="text"
          placeholder="JavaScript, Python, C++"
          onChange={handleChange}
        />
        <small>Separate them with commas.</small>
      </label>
      <label className="field">
        <span>Technologies and tools</span>
        <input
          name="technologies"
          value={userData.technologies.join(",")}
          type="text"
          placeholder="React, Node.js, MongoDB, Git"
          onChange={handleChange}
        />
      </label>

      <h2 className="groupTitle">Projects</h2>
      {userData.aboutProject.map((proj, index) => {
        return (
          <div className="entry" key={index}>
            <div className="entryHead">
              <h3>Project {index + 1}</h3>
            </div>
            <label className="field">
              <span>Project name</span>
              <input
                name="projectName"
                value={proj.projectName}
                type="text"
                placeholder="Campus Events Portal"
                onChange={(e) => {
                  handleProjectChange(e, index);
                }}
              />
            </label>
            <label className="field">
              <span>What did you build?</span>
              <textarea
                name="projectDescription"
                placeholder="A site where students sign up for college events. I made the API in Express and added live seat counts with Socket.IO."
                value={proj.projectDescription}
                onChange={(e) => {
                  handleProjectChange(e, index);
                }}
              ></textarea>
              <small>Plain words are fine. AI turns this into 2–3 resume bullet points.</small>
            </label>
            <div className="entryActions">
              <button
                type="button"
                className="btn btn-secondary btn-small"
                disabled={generating !== null}
                onClick={() => {
                  generatePoints(index);
                }}
              >
                {generating === `description-${index}` ? "Generating..." : "Generate Points"}
              </button>
            </div>
            <div className="field-row">
              <label className="field">
                <span>Tech used</span>
                <input
                  name="techUsed"
                  value={proj.techUsed}
                  type="text"
                  placeholder="React, Express, Socket.IO"
                  onChange={(e) => {
                    handleProjectChange(e, index);
                  }}
                />
              </label>
              <label className="field">
                <span>Project link</span>
                <input
                  name="projectLink"
                  value={proj.projectLink}
                  type="url"
                  placeholder="https://github.com/..."
                  onChange={(e) => {
                    handleProjectChange(e, index);
                  }}
                />
              </label>
            </div>
          </div>
        );
      })}
      <div className="entryActions">
        <button type="button" className="btn btn-secondary" onClick={addProject}>
          Add another project
        </button>
        {userData.aboutProject.length > 1 && (
          <button type="button" className="btn btn-ghost" onClick={removeLastProject}>
            Remove last project
          </button>
        )}
      </div>
    </div>
  );
};

export default Skill;
