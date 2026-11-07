import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const DRAFT_KEY = "resume-builder-draft";

const emptyUserData = {
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
};

// The draft saved in this browser, so a page refresh doesn't wipe the resume.
const loadDraft = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (!saved || typeof saved !== "object") return null;
    return {
      userData: { ...emptyUserData, ...saved.userData },
      points: Array.isArray(saved.points) ? saved.points : [],
      certi: Array.isArray(saved.certi) ? saved.certi : [],
    };
  } catch {
    return null;
  }
};

// Turns an Axios error into a message the user can read.
const errorMessage = async (error, fallback) => {
  let data = error.response?.data;
  // A failed PDF request comes back as a Blob (responseType "blob"), so read it as JSON first.
  if (data instanceof Blob) {
    try {
      data = JSON.parse(await data.text());
    } catch {
      data = null;
    }
  }
  if (data?.message) return data.message;
  if (!error.response) {
    return "Couldn't reach the server. Check that the backend is running and try again.";
  }
  return fallback;
};

const UserContextProvider = ({ children }) => {
  // Backend address from FRONTEND/.env (VITE_API_URL). Falls back to localhost only in development,
  // so a production build without it fails visibly instead of calling the user's own computer.
  const url =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:4000" : "");

  const [draft] = useState(loadDraft);
  // points[i] / certi[i] hold the AI bullets for project i / certificate i.
  const [points, setPoints] = useState(draft?.points ?? []);
  const [certi, setcerti] = useState(draft?.certi ?? []);
  const [userData, setUserData] = useState(draft?.userData ?? emptyUserData);
  // Which "Generate" button is waiting for the AI, e.g. "description-0".
  const [generating, setGenerating] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ userData, points, certi }));
    } catch {
      // Storage full or blocked (private mode): the app still works, it just won't remember.
    }
  }, [userData, points, certi]);

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

  // Copies the list AND the changed item, so the previous state object is never mutated.
  const updateListItem = (listName, index, name, value) => {
    setUserData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    updateListItem("aboutProject", index, name, value);
  };

  const handleCertificateChange = (e, index) => {
    const { name, value } = e.target;
    updateListItem("aboutCertificate", index, name, value);
  };

  const handelCollageData = (e, index) => {
    const { name, value } = e.target;
    updateListItem("aboutCollage", index, name, value);
  };

  // Removes the last project/certificate together with its AI points, so indexes stay matched.
  // The form always keeps at least one project/certificate.
  const removeLastProject = () => {
    const remaining = userData.aboutProject.length - 1;
    if (remaining < 1) return;
    setUserData((prev) => ({ ...prev, aboutProject: prev.aboutProject.slice(0, remaining) }));
    setPoints((prev) => prev.slice(0, remaining));
  };

  const removeLastCertificate = () => {
    const remaining = userData.aboutCertificate.length - 1;
    if (remaining < 1) return;
    setUserData((prev) => ({ ...prev, aboutCertificate: prev.aboutCertificate.slice(0, remaining) }));
    setcerti((prev) => prev.slice(0, remaining));
  };

  const resetResume = () => {
    setUserData(emptyUserData);
    setPoints([]);
    setcerti([]);
  };

  const sendData = async () => {
    setDownloading(true);
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
      // Free the in-memory copy of the PDF once the download has started.
      setTimeout(() => window.URL.revokeObjectURL(pdfurl), 1000);
    } catch (error) {
      alert(await errorMessage(error, "Couldn't create the PDF. Please try again."));
    } finally {
      setDownloading(false);
    }
  };

  const generatePoints = async (index, type = "description") => {
    const text =
      type === "certificate"
        ? userData.aboutCertificate[index]?.certificateDescription
        : userData.aboutProject[index]?.projectDescription;
    if (!text || !text.trim()) {
      alert("Write a description first, then generate points.");
      return;
    }

    setGenerating(`${type}-${index}`);
    try {
      const response = await axios.post(`${url}/api/resume/description`, {
        discription: text,
        type,
      });
      // Store the bullets at this item's index (not appended), so they stay with the right project.
      const setList = type === "certificate" ? setcerti : setPoints;
      setList((prev) => {
        const next = [...prev];
        next[index] = response.data.data;
        return next;
      });
    } catch (error) {
      alert(await errorMessage(error, "Couldn't generate points. Please try again."));
    } finally {
      setGenerating(null);
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
      throw new Error(await errorMessage(error, "Couldn't check the score. Please try again."));
    }
  };

  const contextValue = {
    userData,
    setUserData,
    handleChange,
    handleProjectChange,
    handleCertificateChange,
    handelCollageData,
    removeLastProject,
    removeLastCertificate,
    resetResume,
    sendData,
    downloading,
    points,
    generatePoints,
    generating,
    certi,
    checkAtsScore,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
