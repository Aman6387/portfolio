import { useEffect, useRef, useState } from "react";
import { portfolio, type Project } from "../content/portfolio";
import { useReveal } from "../hooks/useReveal";
import {
  MdArrowOutward,
  MdCode,
  MdSportsEsports,
  MdBuild,
} from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import {
  PROJECT_SHOW_VIDEO_EVENT,
  projectSlug,
  projectVideoHash,
} from "../utils/projectDeepLink";
import "./Projects.css";

function projectLiveUrl(project: Project) {
  return project.demo ?? project.github ?? project.link;
}

type GalleryItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

function getGalleryItems(project: Project): GalleryItem[] {
  const images: GalleryItem[] = project.images.map((src) => ({
    type: "image" as const,
    src,
  }));
  if (!project.video) return images;
  return [
    {
      type: "video",
      src: project.video,
      poster: project.images[0],
    },
    ...images,
  ];
}

function GalleryVideo({
  id,
  src,
  poster,
  title,
}: {
  id?: string;
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
    const el = ref.current;
    if (!el) return;
    el.load();
    const play = el.play();
    if (play !== undefined) {
      play.catch(() => {
        /* autoplay blocked until user interacts — controls still work */
      });
    }
  }, [src]);

  if (loadError) {
    return (
      <p className="work-gallery-video-error" role="status">
        Video could not be loaded. Check that the file exists at{" "}
        <code>{src}</code>
      </p>
    );
  }

  return (
    <video
      id={id}
      ref={ref}
      key={src}
      src={src}
      poster={poster}
      controls
      playsInline
      muted
      loop
      preload="auto"
      onError={() => setLoadError(true)}
      aria-label={`${title} gameplay video`}
    />
  );
}

function FeaturedProject({
  project,
  index,
  showBadge = false,
}: {
  project: Project;
  index: number;
  showBadge?: boolean;
}) {
  const galleryItems = getGalleryItems(project);
  const [activeShot, setActiveShot] = useState(0);
  const activeItem = galleryItems[activeShot] ?? galleryItems[0];
  const slug = projectSlug(project.title);
  const videoId = projectVideoHash(slug);

  useEffect(() => {
    const onShowVideo = (event: Event) => {
      const { slug: targetSlug } = (event as CustomEvent<{ slug: string }>).detail;
      if (targetSlug === slug && project.video) {
        setActiveShot(0);
      }
    };
    window.addEventListener(PROJECT_SHOW_VIDEO_EVENT, onShowVideo);
    return () =>
      window.removeEventListener(PROJECT_SHOW_VIDEO_EVENT, onShowVideo);
  }, [slug, project.video]);

  return (
    <article className="work-featured" id={slug}>
      <div className="work-featured-top">
        <div className="work-featured-info">
          <div className="work-featured-head">
            <span className="work-num">0{index + 1}</span>
            {showBadge && <span className="work-badge">Featured Project</span>}
          </div>
          <h3>{project.title}</h3>
          <p className="work-cat">{project.category}</p>
          <p className="work-desc">{project.description}</p>
          <a
            href={projectLiveUrl(project)}
            target="_blank"
            rel="noopener noreferrer"
            className="work-cta"
          >
            View Project <MdArrowOutward />
          </a>
        </div>
        <div
          className={`work-gallery${project.images.length > 2 ? " work-gallery--many" : ""}${(project.galleryAspect ?? "landscape") === "landscape" ? " work-gallery--landscape" : " work-gallery--portrait"}`}
        >
          <div
            className={`work-gallery-viewport work-gallery-viewport--${project.galleryAspect ?? "landscape"}`}
          >
            {activeItem?.type === "video" ? (
              <GalleryVideo
                id={videoId}
                src={activeItem.src}
                poster={activeItem.poster}
                title={project.title}
              />
            ) : (
              <img
                src={activeItem?.src ?? project.images[0]}
                alt={`${project.title} screenshot ${activeShot + 1}`}
              />
            )}
          </div>
          {galleryItems.length > 1 && (
            <div className="work-gallery-thumbs">
              {galleryItems.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  className={`${i === activeShot ? "active" : ""}${item.type === "video" ? " is-video" : ""}`}
                  onClick={() => setActiveShot(i)}
                  aria-label={item.type === "video" ? "Gameplay video" : `Screenshot ${i + 1}`}
                >
                  {item.type === "video" ? (
                    <>
                      <img src={item.poster ?? project.images[0]} alt="" />
                      <span className="work-thumb-play" aria-hidden="true" />
                    </>
                  ) : (
                    <img src={item.src} alt="" />
                  )}
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
  const ref = useReveal<HTMLHeadingElement>();
  const showcaseProjects = portfolio.projects.filter((p) => p.featured || p.showcase);
  const cardProjects = portfolio.projects.filter((p) => !p.featured && !p.showcase);

  return (
    <section className="work-section section-container" id="work">
      <div className="work-container">
        <h2 className="reveal" ref={ref}>
          My <span>Work</span>
        </h2>
        {showcaseProjects.map((project) => (
          <FeaturedProject
            key={project.title}
            project={project}
            index={portfolio.projects.indexOf(project)}
            showBadge={Boolean(project.featured)}
          />
        ))}
        {cardProjects.length > 0 && (
          <div className="work-grid">
            {cardProjects.map((project) => (
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
