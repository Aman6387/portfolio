import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PROJECTS = [
  {
    title: "2D Platformer Adventure Game",
    category: "Android · Unity 2D",
    toolsHeading: "Tools & features",
    toolsDesc:
      "Unity 2D, C#, Physics2D, Tilemap, Animator, touch controls, prefabs, sprite atlasing, mobile FPS tuning.",
    image: "/images/placeholder.svg",
    alt: "2D platformer project preview",
    link: "https://www.linkedin.com/in/aman6387",
  },
  {
    title: "Contactoo — Smart Contact Manager",
    category: "Full-stack · Java · React",
    toolsHeading: "Tools & features",
    toolsDesc:
      "Java, Spring Boot, React, MySQL, REST APIs, responsive UI, CRUD workflows, team delivery.",
    image: "/images/placeholder.svg",
    alt: "Contactoo full-stack project preview",
    link: "https://www.linkedin.com/in/aman6387",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (!box.length) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding, 10) / 2;
      translateX =
        rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {PROJECTS.map((project, index) => (
            <div className="work-box" key={project.title}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>{project.toolsHeading}</h4>
                <p>{project.toolsDesc}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.alt}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
