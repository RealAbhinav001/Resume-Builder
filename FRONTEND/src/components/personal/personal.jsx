import "./personal.css";
import { UserContext } from "../../context/userInfo";
import { useContext } from "react";

const Personal = () => {
  const { userData, handleChange } = useContext(UserContext);
  return (
    <div className="formStack">
      <div className="field-row">
        <label className="field">
          <span>First name</span>
          <input
            name="firstName"
            value={userData.firstName}
            type="text"
            autoComplete="given-name"
            placeholder="Priya"
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span>Last name</span>
          <input
            name="lastName"
            value={userData.lastName}
            type="text"
            autoComplete="family-name"
            placeholder="Sharma"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Email</span>
          <input
            name="gmail"
            value={userData.gmail}
            type="email"
            autoComplete="email"
            placeholder="priya.sharma@gmail.com"
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span>Phone number</span>
          <input
            name="phoneNumber"
            value={userData.phoneNumber}
            type="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            onChange={handleChange}
          />
        </label>
      </div>
      <label className="field">
        <span>GitHub profile</span>
        <input
          name="gitHub"
          value={userData.gitHub}
          type="url"
          placeholder="https://github.com/your-username"
          onChange={handleChange}
        />
      </label>
      <label className="field">
        <span>LinkedIn profile</span>
        <input
          name="linkedin"
          value={userData.linkedin}
          type="url"
          placeholder="https://linkedin.com/in/your-name"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default Personal;
