import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { portfolio } from "../content/portfolio";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href={`tel:${portfolio.phone.replace(/\s/g, "")}`}>
                {portfolio.phone}
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={portfolio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href={portfolio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{portfolio.name}</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
