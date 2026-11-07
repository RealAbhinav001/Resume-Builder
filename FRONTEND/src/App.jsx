import "./App.css";
import Home from "./pages/home/home";
import { Route, Routes } from "react-router-dom";
import Resume from "./pages/resume/resume";
import Ats from "./pages/ats/ats";

const App = () => {
  return (
    <div className="appContainer">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/ats" element={<Ats />} />
      </Routes>
    </div>
  );
};

export default App;
