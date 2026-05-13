import { portfolio } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import "./Career.css";

const Career = () => {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section career">
      <div className="section-inner reveal" ref={ref}>
        <p className="section-label">Experience</p>
        <h2 className="section-title">
          Career <span>timeline</span>
        </h2>
        <ol className="career-list">
          {portfolio.career.map((job, index) => (
            <li key={job.role} className="career-item hud-card">
              <div className="career-marker">{String(index + 1).padStart(2, "0")}</div>
              <div className="career-body">
                <div className="career-head">
                  <div>
                    <h3>{job.role}</h3>
                    <p className="career-company">{job.company}</p>
                  </div>
                  <span className="career-period">{job.period}</span>
                </div>
                <p className="career-desc">{job.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Career;
