import { portfolio } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import "./Skills.css";

const Skills = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section skills" id="skills">
      <div className="section-inner reveal" ref={ref}>
        <p className="section-label">Skills</p>
        <h2 className="section-title">
          What I <span>do</span>
        </h2>
        <div className="skills-grid">
          {portfolio.skills.map((skill) => (
            <article key={skill.title} className="skill-card hud-card">
              <h3>{skill.title}</h3>
              <p className="skill-sub">{skill.subtitle}</p>
              <p className="skill-desc">{skill.description}</p>
              <div className="skill-tags">
                {skill.tags.map((tag) => (
                  <span key={tag} className="skill-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
