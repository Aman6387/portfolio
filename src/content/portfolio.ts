export const portfolio = {
  name: "Aman Pandey",
  initials: "AP",
  role: "Unity Game Developer",
  tagline: "I build 2D & 3D games and ship them across mobile and desktop.",
  location: "Ahmedabad, India",
  yearsFocus: "2+ yrs Unity",
  email: "aman.pandey12062002@gmail.com",
  phone: "+91 63870 00490",
  linkedin: "https://www.linkedin.com/in/aman6387",
  github: "https://github.com/Aman6387",
  resumeUrl: "/resume.pdf",
  about: [
    "Computer Science graduate with expertise in Unity game development, C#, and interactive experiences. I ship 2D and 3D games across Android, iOS, Windows, and Mac—with strong gameplay, animation, physics, and mobile performance tuning. I also completed a full-stack Java internship (Spring Boot, React, MySQL), so I'm comfortable owning features end-to-end beyond the engine.",
    "At Vihaa Infotech I design modes and UI, manage store submissions, and ship updates that improve retention. Outside of work: chess, hiking, and playing mobile games to stay close to what players feel day to day.",
  ],
  skills: [
    {
      title: "Game Development",
      subtitle: "Unity · gameplay · ships",
      description:
        "2D/3D gameplay, animation pipelines, physics, debugging, and mobile optimisation—shipping builds players actually keep installed.",
      tags: [
        "Unity",
        "C#",
        "2D Animation",
        "Game Design",
        "Physics2D",
        "Android",
        "iOS",
        "Debugging",
        "Platform polish",
      ],
    },
    {
      title: "Full-Stack",
      subtitle: "Java · Spring · React",
      description:
        "REST APIs, responsive UI, and database work from internship experience—useful when game projects need tooling or live ops dashboards.",
      tags: ["Java", "Spring Boot", "React", "MySQL", "REST", "HTML/CSS"],
    },
  ],
  career: [
    {
      role: "Unity Game Developer",
      company: "Vihaa Infotech · Ahmedabad, India",
      period: "Present",
      description:
        "Develop and implement new game modes to boost engagement. Design and refine UI for clear, polished interaction. Manage cross-platform submissions for Android, iOS, Windows, and Mac with guideline compliance. Coordinate updates and patches that improve performance, fix issues, and lift retention.",
    },
    {
      role: "Full-Stack Java Developer — Intern",
      company: "Code Planet Technologies · Contactoo",
      period: "12 months",
      description:
        "Built and maintained RESTful APIs for contact management—add, list, update, and delete—with stronger reliability. Implemented responsive UI for key flows with HTML, CSS, JavaScript, and React. Collaborated in a five-person team using Java, Spring Boot, React, and MySQL to deliver an integrated smart contact manager. Streamlined MySQL operations for faster reads and writes.",
    },
  ],
  projects: [
    {
      title: "2D Platformer Adventure Game",
      category: "Android · Unity 2D",
      description:
        "Unity 2D, C#, Physics2D, Tilemap, Animator, touch controls, prefabs, sprite atlasing, mobile FPS tuning.",
      image: "/images/projects/platformer.svg",
      link: "https://www.linkedin.com/in/aman6387",
    },
    {
      title: "Contactoo — Smart Contact Manager",
      category: "Full-stack · Java · React",
      description:
        "Java, Spring Boot, React, MySQL, REST APIs, responsive UI, CRUD workflows, team delivery.",
      image: "/images/projects/contactoo.svg",
      link: "https://www.linkedin.com/in/aman6387",
    },
  ],
  techStack: [
    "Unity",
    "C#",
    "Git",
    "VS Code",
    "Android",
    "iOS",
  ],
} as const;
