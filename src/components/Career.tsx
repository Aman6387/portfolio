import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Unity Game Developer</h4>
                <h5>Vihaa Infotech · Ahmedabad, India</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Develop and implement new game modes to boost engagement.
              Design and refine UI for clear, polished interaction. Manage
              cross-platform submissions for Android, iOS, Windows, and Mac
              with guideline compliance. Coordinate updates and patches that
              improve performance, fix issues, and lift retention.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Java Developer — Intern</h4>
                <h5>Code Planet Technologies · Contactoo</h5>
              </div>
              <h3>12 MO</h3>
            </div>
            <p>
              Built and maintained RESTful APIs for contact management—add,
              list, update, and delete—with stronger reliability. Implemented
              responsive UI for key flows with HTML, CSS, JavaScript, and React.
              Collaborated in a five-person team using Java, Spring Boot, React,
              and MySQL to deliver an integrated smart contact manager.
              Streamlined MySQL operations for faster reads and writes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
