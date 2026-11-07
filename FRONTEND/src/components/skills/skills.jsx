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
    <div className="skillContainer">
      <input
        name="languages"
        value={userData.languages.join(", ")}
        type="text"
        placeholder="Languages"
        onChange={handleChange}
      />
      <input
        name="technologies"
        value={userData.technologies.join(", ")}
        type="text"
        placeholder="Technologies"
        onChange={handleChange}
      />
      {userData.aboutProject.map((proj, index) => {
        return (
          <div className="projectContainer" key={index}>
            <input
              name="projectName"
              value={proj.projectName}
              type="text"
              placeholder="Project Name"
              onChange={(e) => {
                handleProjectChange(e, index);
              }}
            />
            <textarea
              name="projectDescription"
              placeholder="Project Description"
              value={proj.projectDescription}
              onChange={(e) => {
                handleProjectChange(e, index);
              }}
            ></textarea>
            <button
              disabled={generating !== null}
              onClick={() => {
                generatePoints(index);
              }}
            >
              {generating === `description-${index}` ? "Generating..." : "Generate Points"}
            </button>
            <input
              name="techUsed"
              value={proj.techUsed}
              type="text"
              placeholder="Tech Used Here"
              onChange={(e) => {
                handleProjectChange(e, index);
              }}
            />
            <input
              name="projectLink"
              value={proj.projectLink}
              type="text"
              placeholder="Project Link"
              onChange={(e) => {
                handleProjectChange(e, index);
              }}
            />
          </div>
        );
      })}
      <div className="buttonContainer">
        <button onClick={addProject}>Add Project</button>
        <button onClick={removeLastProject}>Delete Project</button>
      </div>
    </div>
  );
};

export default Skill;
