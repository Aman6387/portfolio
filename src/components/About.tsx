import { portfolio } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import "./About.css";

const About = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section about" id="about">
      <div className="section-inner reveal" ref={ref}>
        <p className="section-label">About</p>
        <h2 className="section-title">
          Who <span>I am</span>
        </h2>
        <div className="about-grid hud-card">
          <div className="about-text">
            {portfolio.about.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <span>Role</span>
              <strong>{portfolio.role}</strong>
            </div>
            <div className="about-stat">
              <span>Location</span>
              <strong>{portfolio.location}</strong>
            </div>
            <div className="about-stat">
              <span>Experience</span>
              <strong>{portfolio.yearsFocus}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
