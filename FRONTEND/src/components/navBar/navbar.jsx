import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        Built-It
      </Link>
      <nav className="topbar-actions" aria-label="Main">
        <Link to="/ats" className="btn btn-ghost">
          Check ATS score
        </Link>
        <Link to="/resume" className="btn btn-primary">
          Build my resume
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
