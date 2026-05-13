import { lazy, Suspense, useEffect } from "react";
import gsap from "gsap";
import { portfolio } from "../content/portfolio";
import "./Hero.css";

const HeroScene = lazy(() => import("./HeroScene"));

type HeroProps = {
  animStart?: boolean;
};

const Hero = ({ animStart = true }: HeroProps) => {
  useEffect(() => {
    if (!animStart) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const targets = ".landing-intro, .landing-info";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: isMobile ? 14 : 30 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.55 : 0.8,
          stagger: 0.12,
          delay: isMobile ? 0.25 : 2.6,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    });

    const fallback = window.setTimeout(() => {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
    }, isMobile ? 1800 : 4500);

    return () => {
      window.clearTimeout(fallback);
      ctx.revert();
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
    };
  }, [animStart]);

  return (
    <section className="landing-section" id="top">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I&apos;m</h2>
          <h1>
            {portfolio.name.split(" ")[0]}
            <br />
            <span>{portfolio.name.split(" ")[1]}</span>
          </h1>
        </div>
        <div className="hero-canvas-layer">
          <Suspense fallback={null}>
            <HeroScene start={animStart} />
          </Suspense>
        </div>
        <div className="landing-info">
          <h3>A Unity</h3>
          <h2 className="landing-info-h2">
            <span>Game</span>
            <span>Developer</span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Hero;
