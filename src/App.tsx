import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Career from "./components/Career";
import Projects from "./components/Projects";
import TechStrip from "./components/TechStrip";
import Contact from "./components/Contact";
import SocialIcons from "./components/SocialIcons";
import Splash from "./components/Splash";

const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!ready && <Splash />}
      <div className={`page ${ready ? "page-ready" : "page-loading"}`}>
        <Navbar />
        <SocialIcons />
        <main>
          <Hero animStart={ready} />
          <div className="divider-angle" />
          <About />
          <Skills />
          <Career />
          <Projects />
          <TechStrip />
          <Contact />
        </main>
      </div>
    </>
  );
};

export default App;
