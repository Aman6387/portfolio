import { useEffect, useRef, useState } from "react";
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
import {
  getHeroIdleFallbackMs,
  getPageFadeDelayMs,
  getSplashDelayMs,
  hasPendingProjectHash,
  markPageSettled,
  notifyHeroModelIdle,
  prepareProjectHashOnLoad,
  setPendingProjectHash,
  tryFlushPendingProjectHash,
} from "./utils/projectDeepLink";

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prepareProjectHashOnLoad();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setSplashDone(true),
      getSplashDelayMs()
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setPendingProjectHash(window.location.hash);
      tryFlushPendingProjectHash();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!splashDone) return;

    const settlePage = () => markPageSettled();

    const fadeTimer = window.setTimeout(settlePage, getPageFadeDelayMs());

    const page = pageRef.current;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== page || event.propertyName !== "opacity") return;
      window.clearTimeout(fadeTimer);
      settlePage();
    };

    page?.addEventListener("transitionend", onTransitionEnd);

    return () => {
      window.clearTimeout(fadeTimer);
      page?.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [splashDone]);

  /** Deep link: scroll only after hero idle; fallback if model never finishes */
  useEffect(() => {
    if (!splashDone || !hasPendingProjectHash()) return;

    const fallback = window.setTimeout(
      () => notifyHeroModelIdle(),
      getHeroIdleFallbackMs()
    );
    return () => window.clearTimeout(fallback);
  }, [splashDone]);

  return (
    <>
      {!splashDone && <Splash />}
      <div
        ref={pageRef}
        className={`page ${splashDone ? "page-ready" : "page-loading"}`}
      >
        <Navbar />
        <SocialIcons />
        <main>
          <Hero animStart={splashDone} />
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
