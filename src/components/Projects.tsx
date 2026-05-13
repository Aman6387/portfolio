import { portfolio } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import { MdArrowOutward } from "react-icons/md";
import "./Projects.css";

const Projects = () => {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="work-section section-container reveal" id="work" ref={ref}>
      <div className="work-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-grid">
          {portfolio.projects.map((project, index) => (
            <article key={project.title} className="work-card">
              <div className="work-title">
                <h3>0{index + 1}</h3>
                <div>
                  <h4>{project.title}</h4>
                  <p className="work-cat">{project.category}</p>
                </div>
              </div>
              <p className="work-desc">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="work-link"
              >
                View project <MdArrowOutward />
              </a>
              <img src={project.image} alt={project.title} className="work-img" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
