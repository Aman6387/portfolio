import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { TbNotes } from "react-icons/tb";
import { portfolio } from "../content/portfolio";
import "./SocialIcons.css";

const SocialIcons = () => {
  const [nearContact, setNearContact] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNearContact(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`icons-section${nearContact ? " icons-section--hidden" : ""}`}
      aria-hidden={nearContact}
    >
      <div className="social-icons" id="social">
        <span>
          <a
            href={portfolio.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href={portfolio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={`mailto:${portfolio.email}`} aria-label="Email">
            <MdOutlineEmail />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href={portfolio.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        download="Aman_Pandey_Resume.pdf"
      >
        RESUME
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
