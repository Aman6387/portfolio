import { useState } from "react";
import { portfolio, type Project } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import {
  MdArrowOutward,
  MdCheck,
  MdCode,
  MdSportsEsports,
  MdBuild,
} from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import "./Projects.css";

function projectLiveUrl(project: Project) {
  return project.demo ?? project.github ?? project.link;
}

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const [activeShot, setActiveShot] = useState(0);

  return (
    <article className="work-featured">
      <div className="work-featured-top">
        <div className="work-featured-info">
          <div className="work-featured-head">
            <span className="work-num">0{index + 1}</span>
            <span className="work-badge">Featured Project</span>
          </div>
          <h3>{project.title}</h3>
          <p className="work-cat">{project.category}</p>
          <p className="work-desc">{project.description}</p>
          <ul className="work-checklist">
            {project.features.map((item) => (
              <li key={item}>
                <MdCheck />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href={projectLiveUrl(project)}
            target="_blank"
            rel="noopener noreferrer"
            className="work-cta"
          >
            View Project <MdArrowOutward />
          </a>
        </div>
        <div className="work-gallery">
          <div className="work-gallery-stack">
            {project.images.map((src, i) => (
              <div
                key={src}
                className={`work-gallery-shot${i === activeShot ? " active" : ""}`}
              >
                <img src={src} alt={`${project.title} screenshot ${i + 1}`} />
              </div>
            ))}
          </div>
          {project.images.length > 1 && (
            <div className="work-gallery-thumbs">
              {project.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === activeShot ? "active" : ""}
                  onClick={() => setActiveShot(i)}
                  aria-label={`Screenshot ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="work-detail-grid">
        <div className="work-detail-card">
          <h4>
            <MdSportsEsports /> Game Features
          </h4>
          <ul>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="work-detail-card">
          <h4>
            <MdCode /> Tech Stack
          </h4>
          <div className="work-tags">
            {project.techStack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="work-detail-card">
          <h4>
            <MdBuild /> Tools Used
          </h4>
          <div className="work-tags">
            {project.tools.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="work-featured-footer">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="work-footer-link"
          >
            <FaGithub /> View on GitHub
          </a>
        )}
        <a
          href={projectLiveUrl(project)}
          target="_blank"
          rel="noopener noreferrer"
          className="work-footer-link"
        >
          Live Demo <MdArrowOutward />
        </a>
      </div>
    </article>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="work-card">
      <div className="work-title">
        <h3>0{index + 1}</h3>
        <div>
          <h4>{project.title}</h4>
          <p className="work-cat">{project.category}</p>
        </div>
      </div>
      <p className="work-desc">{project.description}</p>
      <div className="work-tags compact">
        {project.techStack.slice(0, 5).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <a
        href={projectLiveUrl(project)}
        target="_blank"
        rel="noopener noreferrer"
        className="work-link"
      >
        View project <MdArrowOutward />
      </a>
      <img src={project.images[0]} alt={project.title} className="work-img" />
    </article>
  );
}

const Projects = () => {
  const ref = useReveal<HTMLElement>();
  const featured = portfolio.projects.find((p) => p.featured);
  const others = portfolio.projects.filter((p) => !p.featured);

  return (
    <section className="work-section section-container reveal" id="work" ref={ref}>
      <div className="work-container">
        <h2>
          My <span>Work</span>
        </h2>
        {featured && (
          <FeaturedProject
            project={featured}
            index={portfolio.projects.indexOf(featured)}
          />
        )}
        {others.length > 0 && (
          <div className="work-grid">
            {others.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={portfolio.projects.indexOf(project)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
