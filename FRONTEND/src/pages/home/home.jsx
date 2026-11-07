import Main from "../../components/main/mainContainer";
import Navbar from "../../components/navBar/navbar";
import "./home.css";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Main />
      <footer className="homeFooter">
        <p>Built-It: an AI resume builder made with React, Express, OpenAI and Puppeteer.</p>
      </footer>
    </div>
  );
};

export default Home;
