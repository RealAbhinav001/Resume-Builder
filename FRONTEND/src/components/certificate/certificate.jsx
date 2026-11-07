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
    <div className="formStack">
      {userData.aboutCertificate.map((item, key) => {
        return (
          <div className="entry" key={key}>
            <div className="entryHead">
              <h3>Certificate {key + 1}</h3>
            </div>
            <label className="field">
              <span>Certificate name</span>
              <input
                name="certificateName"
                value={item.certificateName}
                type="text"
                placeholder="AWS Cloud Practitioner"
                onChange={(e) => handleCertificateChange(e, key)}
              />
            </label>
            <label className="field">
              <span>What did you learn?</span>
              <textarea
                name="certificateDescription"
                value={item.certificateDescription}
                placeholder="Core AWS services like EC2 and S3, pricing, and security basics."
                onChange={(e) => handleCertificateChange(e, key)}
              ></textarea>
            </label>
            <div className="entryActions">
              <button
                type="button"
                className="btn btn-secondary btn-small"
                disabled={generating !== null}
                onClick={() => {
                  generatePoints(key, "certificate");
                }}
              >
                {generating === `certificate-${key}` ? "Generating..." : "Generate Description"}
              </button>
            </div>
            <label className="field">
              <span>Certificate link</span>
              <input
                name="certificateLink"
                value={item.certificateLink}
                type="url"
                placeholder="https://..."
                onChange={(e) => handleCertificateChange(e, key)}
              />
            </label>
          </div>
        );
      })}
      <div className="entryActions">
        <button type="button" className="btn btn-secondary" onClick={addCertificate}>
          Add another certificate
        </button>
        {userData.aboutCertificate.length > 1 && (
          <button type="button" className="btn btn-ghost" onClick={removeLastCertificate}>
            Remove last certificate
          </button>
        )}
      </div>
    </div>
  );
};

export default Certificate;
