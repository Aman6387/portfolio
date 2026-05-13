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
    const ctx = gsap.context(() => {
      gsap.from(".landing-intro, .landing-info", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        delay: 2.6,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
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
        <div className="landing-info">
          <h3>A Unity</h3>
          <h2 className="landing-info-h2">
            <span>Game</span>
            <span>Developer</span>
          </h2>
        </div>
        <div className="hero-canvas-layer">
          <Suspense fallback={null}>
            <HeroScene start={animStart} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Hero;
