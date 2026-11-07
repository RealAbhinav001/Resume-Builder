import "./education.css";
import { useContext } from "react";
import { UserContext } from "../../context/userInfo";

const Education = () => {
  const { userData, setUserData, handleChange, handelCollageData } = useContext(UserContext);

  const addCollege = () => {
    setUserData((prev) => ({
      ...prev,
      aboutCollage: [...prev.aboutCollage, { collageName: "", collageDegree: "", collageGrade: "" }],
    }));
  };

  const removeLastCollege = () => {
    setUserData((prev) =>
      prev.aboutCollage.length > 1 ? { ...prev, aboutCollage: prev.aboutCollage.slice(0, -1) } : prev
    );
  };

  return (
    <div className="formStack">
      <h2 className="groupTitle">College</h2>
      {userData.aboutCollage.map((item, key) => {
        return (
          <div className="entry" key={key}>
            <label className="field">
              <span>College name</span>
              <input
                name="collageName"
                value={item.collageName}
                type="text"
                placeholder="VIT Bhopal University"
                onChange={(e) => handelCollageData(e, key)}
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Degree</span>
                <input
                  name="collageDegree"
                  value={item.collageDegree}
                  type="text"
                  placeholder="B.Tech Computer Science"
                  onChange={(e) => handelCollageData(e, key)}
                />
              </label>
              <label className="field">
                <span>CGPA or grade</span>
                <input
                  name="collageGrade"
                  value={item.collageGrade}
                  type="text"
                  inputMode="decimal"
                  placeholder="8.4"
                  onChange={(e) => handelCollageData(e, key)}
                />
              </label>
            </div>
          </div>
        );
      })}
      <div className="entryActions">
        <button type="button" className="btn btn-secondary" onClick={addCollege}>
          Add another college
        </button>
        {userData.aboutCollage.length > 1 && (
          <button type="button" className="btn btn-ghost" onClick={removeLastCollege}>
            Remove last college
          </button>
        )}
      </div>

      <h2 className="groupTitle">School</h2>
      <div className="entry">
        <h3>Class 12</h3>
        <div className="field-row-3">
          <label className="field">
            <span>School name</span>
            <input
              name="seniorSecondaryName"
              value={userData.seniorSecondaryName}
              type="text"
              placeholder="Delhi Public School"
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span>Class</span>
            <input
              name="seniorSecondaryClass"
              value={userData.seniorSecondaryClass}
              type="text"
              inputMode="numeric"
              placeholder="12"
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span>Score (%)</span>
            <input
              name="seniorSecondaryGrade"
              value={userData.seniorSecondaryGrade}
              type="text"
              inputMode="decimal"
              placeholder="91"
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      <div className="entry">
        <h3>Class 10</h3>
        <div className="field-row-3">
          <label className="field">
            <span>School name</span>
            <input
              name="higherName"
              value={userData.higherName}
              type="text"
              placeholder="Delhi Public School"
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span>Class</span>
            <input
              name="higherClass"
              value={userData.higherClass}
              type="text"
              inputMode="numeric"
              placeholder="10"
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span>Score (%)</span>
            <input
              name="higherGrade"
              value={userData.higherGrade}
              type="text"
              inputMode="decimal"
              placeholder="94"
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Education;
