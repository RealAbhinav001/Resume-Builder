import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const url = "http://localhost:4000";
  const [points, setPoints] = useState([]);
  const [certi, setcerti] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gmail: "",
    phoneNumber: "",
    gitHub: "",
    linkedin: "",
    languages: [],
    technologies: [],
    aboutProject: [
      {
        projectName: "",
        projectDescription: "",
        projectLink: "",
        techUsed: "",
      },
    ],
    aboutCertificate: [
      {
        certificateName: "",
        certificateDescription: "",
        certificateLink: "",
      },
    ],
    aboutCollage: [
      {
        collageName: "",
        collageDegree: "",
        collageGrade: "",
      },
    ],
    seniorSecondaryName: "",
    seniorSecondaryClass: "",
    seniorSecondaryGrade: "",
    higherName: "",
    higherClass: "",
    higherGrade: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (Array.isArray(userData[name])) {
      setUserData((prev) => ({
        ...prev,
        [name]: value.split(","),
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    const projectData = [...userData.aboutProject];
    projectData[index][name] = value;

    setUserData((prev) => ({
      ...prev,
      aboutProject: projectData,
    }));
  };

  const handleCertificateChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCertificate = [...userData.aboutCertificate];
    updatedCertificate[index][name] = value;

    setUserData((prev) => ({
      ...prev,
      aboutCertificate: updatedCertificate,
    }));
  };

  const handelCollageData = (e, index) => {
    const { name, value } = e.target;
    const updatedCollage = [...userData.aboutCollage];
    updatedCollage[index][name] = value;

    setUserData((prev) => ({
      ...prev,
      aboutCollage: updatedCollage,
    }));
  };

  const sendData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/resume/generatepdf`,
        { userData, points, certi },
        {
          responseType: "blob",
        }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfurl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfurl;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const generatePoints = async (index, type = "description") => {
    try {
      const response = await axios.post(`${url}/api/resume/description`, {
        discription:
          type === "certificate"
            ? userData.aboutCertificate[index].certificateDescription
            : userData.aboutProject[index].projectDescription,
        type,
      });
      {
        type === "description"
          ? setPoints((prev) => [...prev, response.data.data])
          : setcerti((prev) => [...prev, response.data.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Returns { score, matched, missing, totalKeywords }. Throws an Error with the server's message on failure.
  const checkAtsScore = async (jobDescription) => {
    try {
      const response = await axios.post(`${url}/api/resume/ats`, {
        jobDescription,
        userData,
        points,
        certi,
      });
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Couldn't reach the server. Check that the backend is running and try again.";
      throw new Error(message);
    }
  };

  const contextValue = {
    userData,
    setUserData,
    handleChange,
    handleProjectChange,
    handleCertificateChange,
    handelCollageData,
    sendData,
    points,
    generatePoints,
    certi,
    checkAtsScore,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
