import { portfolio } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import "./TechStrip.css";

const TechStrip = () => {
  const ref = useReveal<HTMLDivElement>();
  const items = [...portfolio.techStack, ...portfolio.techStack];

  return (
    <section className="section tech-strip">
      <div className="section-inner reveal" ref={ref}>
        <p className="section-label">Toolkit</p>
        <h2 className="section-title">
          Tech <span>stack</span>
        </h2>
        <div className="tech-marquee" aria-hidden="true">
          <div className="tech-track">
            {items.map((tech, i) => (
              <span key={`${tech}-${i}`} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStrip;
