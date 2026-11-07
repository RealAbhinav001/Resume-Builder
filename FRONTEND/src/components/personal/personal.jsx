import "./personal.css";
import { UserContext } from "../../context/userInfo";
import { useContext } from "react";

const Personal = () => {
  const { userData, handleChange } = useContext(UserContext);
  return (
    <div className="personalinfoContainer">
      <div className="name-container twoInfo">
        <input
          name="firstName"
          value={userData.firstName}
          type="text"
          placeholder="First Name"
          onChange={handleChange}
        />
        <input
          name="lastName"
          value={userData.lastName}
          type="text"
          placeholder="Last Name"
          onChange={handleChange}
        />
      </div>
      <div className="otherInfo">
        <input
          name="gmail"
          value={userData.gmail}
          type="text"
          placeholder="Gmail Here"
          onChange={handleChange}
        />
        <input
          name="phoneNumber"
          value={userData.phoneNumber}
          type="number"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          name="gitHub"
          value={userData.gitHub}
          type="text"
          placeholder="GitHub Link"
          onChange={handleChange}
        />
        <input
          name="linkedin"
          value={userData.linkedin}
          type="text"
          placeholder="Linkedin"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Personal;
