import "./certificate.css";
import { useContext } from "react";
import { UserContext } from "../../context/userInfo";

const Certificate = () => {
  const {
    userData,
    handleCertificateChange,
    setUserData,
    generatePoints,
    generating,
    removeLastCertificate,
  } = useContext(UserContext);

  const addCertificate = () => {
    const newCertificate = {
      certificateName: "",
      certificateDescription: "",
      certificateLink: "",
    };
    setUserData((prev) => ({
      ...prev,
      aboutCertificate: [...prev.aboutCertificate, newCertificate],
    }));
  };

  return (
    <div className="certificateContainer">
      {userData.aboutCertificate.map((item, key) => {
        return (
          <div className="certificateInput" key={key}>
            <input
              name="certificateName"
              value={item.certificateName}
              type="text"
              placeholder="Certificate Name"
              onChange={(e) => handleCertificateChange(e, key)}
            />
            <textarea
              name="certificateDescription"
              value={item.certificateDescription}
              placeholder="About Certificate"
              onChange={(e) => handleCertificateChange(e, key)}
            ></textarea>
            <button
              disabled={generating !== null}
              onClick={() => {
                generatePoints(key, "certificate");
              }}
            >
              {generating === `certificate-${key}` ? "Generating..." : "Generate Description"}
            </button>
            <input
              name="certificateLink"
              value={item.certificateLink}
              type="text"
              placeholder="Certificate Link"
              onChange={(e) => handleCertificateChange(e, key)}
            />
          </div>
        );
      })}
      <div className="certificateButton">
        <button onClick={addCertificate}>Add Certificate</button>

        <button onClick={removeLastCertificate}>Delete Certificate</button>
      </div>
    </div>
  );
};

export default Certificate;
