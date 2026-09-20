import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import { HomeInfo, Loader, ExperienceTimeline } from "../components";
import { ComputerRoom } from "../models";
import {
  skills,
  skillCategories,
  projects,
  personalInfo,
  personalProjects,
  openSource,
} from "../constants";
import { arrow } from "../assets/icons";

const PAGE_LABELS = ["Home", "About", "Experience", "Projects", "Work", "Contact"];
const TOTAL_PAGES = PAGE_LABELS.length;

const SectionEyebrow = ({ children }) => (
  <p className="text-sky-400/90 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
    {children}
  </p>
);

const Home = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredDot, setHoveredDot] = useState(null);

  const outerRef = useRef(null);
  const sectionRefs = useRef([]);
  const pageRef = useRef(0);
  const gesture = useRef({ handled: false, timer: null });

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goToPage = useCallback((index) => {
    setCurrentPage(Math.max(0, Math.min(index, TOTAL_PAGES - 1)));
  }, []);

  // Listen for nav requests from the header
  useEffect(() => {
    const onNavigate = (e) => {
      const page = e.detail?.page;
      if (typeof page === "number") goToPage(page);
    };
    window.addEventListener("portfolio:goto", onNavigate);
    return () => window.removeEventListener("portfolio:goto", onNavigate);
  }, [goToPage]);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onWheel = (e) => {
      const g = gesture.current;
      clearTimeout(g.timer);
      g.timer = setTimeout(() => {
        g.handled = false;
      }, 200);

      const section = sectionRefs.current[pageRef.current];
      if (section && section.scrollHeight > section.clientHeight + 2) {
        const atTop = section.scrollTop <= 1;
        const atBottom =
          section.scrollTop + section.clientHeight >= section.scrollHeight - 2;
        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop) return;
      }

      e.preventDefault();
      if (g.handled) return;
      g.handled = true;
      goToPage(pageRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    outer.addEventListener("wheel", onWheel, { passive: false });
    return () => outer.removeEventListener("wheel", onWheel);
  }, [goToPage]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goToPage(pageRef.current + 1);
      if (e.key === "ArrowLeft") goToPage(pageRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPage]);

  const getModelConfig = () => {
    const w = window.innerWidth;
    if (w < 480)
      return {
        scale: [0.55, 0.55, 0.55],
        position: [0, -0.5, 0],
        fov: 50,
        cameraPos: [0, 1, 7],
      };
    if (w < 768)
      return {
        scale: [0.65, 0.65, 0.65],
        position: [0, -0.5, 0],
        fov: 48,
        cameraPos: [0, 1, 7],
      };
    if (w < 1024)
      return {
        scale: [0.75, 0.75, 0.75],
        position: [0, -0.5, 0],
        fov: 45,
        cameraPos: [0, 1, 7],
      };
    return {
      scale: [0.85, 0.85, 0.85],
      position: [0, -0.5, 0],
      fov: 45,
      cameraPos: [0, 1, 7],
    };
  };
  const modelConfig = getModelConfig();

  const pageStyle = {
    width: "100vw",
    minWidth: "100vw",
    height: "100vh",
    flexShrink: 0,
  };

  return (
    <div
      ref={outerRef}
      style={{ position: "fixed", inset: 0, background: "#050505", overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          width: `${TOTAL_PAGES * 100}vw`,
          height: "100vh",
          transform: `translateX(-${currentPage * 100}vw)`,
          transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {/* ─── PAGE 0 : Hero ─── */}
        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          style={{
            ...pageStyle,
            overflow: "hidden",
            position: "relative",
            background: "#050505",
            touchAction: "none",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(56,189,248,0.08), transparent 60%)",
            }}
          />

          <div
            className="absolute left-0 right-0 z-10 flex items-center justify-center px-4"
            style={{ top: isMobile ? "64px" : "90px" }}
          >
            {currentStage && <HomeInfo currentStage={currentStage} />}
          </div>

          {isMobile && (
            <div className="absolute bottom-14 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="text-gray-400 text-xs tracking-wide">
                  Touch &amp; drag to rotate
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-gray-400 text-xs tracking-wide">
                  Tap dots to navigate
                </span>
              </div>
            </div>
          )}

          <Canvas
            className={`w-full h-full ${isRotating ? "cursor-grabbing" : "cursor-grab"}`}
            camera={{
              near: 0.1,
              far: 1000,
              position: modelConfig.cameraPos,
              fov: modelConfig.fov,
            }}
            style={{ background: "#050505", touchAction: "none" }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
            }}
          >
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
              <directionalLight position={[-3, 4, -3]} intensity={0.5} color="#4a90e2" />
              <hemisphereLight skyColor="#1a1a2e" groundColor="#000000" intensity={0.3} />
              <ComputerRoom
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                setCurrentStage={setCurrentStage}
                position={modelConfig.position}
                rotation={[0, 0, 0]}
                scale={modelConfig.scale}
              />
            </Suspense>
          </Canvas>

          {!isMobile && (
            <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2 pointer-events-none select-none">
              <span className="text-white/30 text-xs tracking-widest uppercase">
                Scroll
              </span>
              <svg
                className="w-4 h-4 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          )}
        </section>

        {/* ─── PAGE 1 : About ─── */}
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "#050505" }}
          className="px-6 sm:px-16 py-20 hide-scrollbar"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <SectionEyebrow>About</SectionEyebrow>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins leading-tight">
                {personalInfo.name}
              </h2>
              <p className="text-sky-400/80 text-sm sm:text-base mt-3 font-medium">
                {personalInfo.title} · {personalInfo.tagline}
              </p>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
                Building scalable full-stack systems, computer vision pipelines, and
                AI-powered products — from real-time multiplayer platforms to
                multi-country data intelligence.
              </p>
              <p className="text-gray-600 text-sm mt-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-gray-400 transition-colors"
                >
                  {personalInfo.email}
                </a>
                <span className="mx-2">·</span>
                {personalInfo.phone}
              </p>
            </div>

            <div className="mb-16">
              <SectionEyebrow>Education</SectionEyebrow>
              <div className="max-w-xl mx-auto rounded-2xl p-7 border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-sky-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {personalInfo.education.degree}
                    </h4>
                    <p className="text-gray-300 mt-1">
                      {personalInfo.education.university}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span>{personalInfo.education.location}</span>
                      <span>{personalInfo.education.duration}</span>
                      <span>CGPA: {personalInfo.education.gpa}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-14">
              <SectionEyebrow>Core Stack</SectionEyebrow>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center max-w-3xl mx-auto">
                {skills.map((skill) => (
                  <div className="group relative" key={skill.name}>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center transition-all duration-300 hover:border-sky-400/30 hover:bg-sky-500/5 hover:-translate-y-1">
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                      />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionEyebrow>Technical Skills</SectionEyebrow>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
                {skillCategories.map((cat) => (
                  <div
                    key={cat.label}
                    className="rounded-xl p-4 border border-white/[0.05] bg-white/[0.015]"
                  >
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">
                      {cat.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-2.5 py-1 rounded-md text-gray-300 bg-white/[0.04] border border-white/[0.05]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PAGE 2 : Experience ─── */}
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "#050505" }}
          className="px-6 sm:px-16 py-20 hide-scrollbar"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <SectionEyebrow>Career</SectionEyebrow>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins">
                Work Experience
              </h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
                Senior engineering at Backgammon Galaxy, AI consulting at Amplytic, and
                full-stack product work at Nineleaps.
              </p>
            </div>
            <ExperienceTimeline />
          </div>
        </section>

        {/* ─── PAGE 3 : Personal Projects & OSS ─── */}
        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "#050505" }}
          className="px-6 sm:px-16 py-20 hide-scrollbar"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <SectionEyebrow>Open Source & Side Projects</SectionEyebrow>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins">
                Projects
              </h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
                Personal builds and open-source contributions.
              </p>
            </div>

            <div className="flex flex-col gap-5 mb-12">
              {personalProjects.map((project) => {
                const Wrapper = project.github ? "a" : "div";
                const wrapperProps = project.github
                  ? {
                      href: project.github,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {};

                return (
                  <Wrapper
                    key={project.name}
                    {...wrapperProps}
                    className="group rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 transition-all duration-300 hover:bg-white/[0.03]"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${project.accentColor}28`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold font-poppins"
                      style={{
                        background: `${project.accentColor}18`,
                        color: project.accentColor,
                      }}
                    >
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white text-lg sm:text-xl font-semibold font-poppins group-hover:text-sky-300 transition-colors">
                          {project.name}
                        </h3>
                        {project.github && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium uppercase tracking-wide"
                            style={{
                              background: `${project.accentColor}18`,
                              color: project.accentColor,
                            }}
                          >
                            open source
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{project.tagline}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] px-2.5 py-0.5 rounded-md border border-white/5 text-gray-400 bg-white/[0.03]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.github && (
                      <div
                        className="flex-shrink-0 text-sm font-medium"
                        style={{ color: project.accentColor }}
                      >
                        GitHub →
                      </div>
                    )}
                  </Wrapper>
                );
              })}
            </div>

            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4 text-center">
                Open Source Contributions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {openSource.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] hover:border-sky-400/20 hover:bg-white/[0.04] transition-all"
                  >
                    <h4 className="text-white font-semibold font-poppins">{item.name}</h4>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {item.detail}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PAGE 4 : Work Highlights ─── */}
        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "#050505" }}
          className="px-6 sm:px-16 py-20 hide-scrollbar"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <SectionEyebrow>Selected Work</SectionEyebrow>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins">
                Highlights
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Computer vision, AI systems, and real-time platforms — built with
                end-to-end ownership.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="group rounded-2xl p-6 border border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.035] transition-all duration-300 flex flex-col"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-white/5 flex items-center justify-center">
                      {project.iconUrl ? (
                        <img
                          src={project.iconUrl}
                          alt=""
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <span className="text-sky-400 text-sm font-bold">
                          {project.customIcon}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white font-poppins group-hover:text-sky-300 transition-colors">
                      {project.name}
                    </h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-[11px] text-gray-400 rounded-md bg-white/[0.03] border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      View project
                      <img src={arrow} alt="" className="w-3 h-3 object-contain" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PAGE 5 : Contact ─── */}
        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "#050505" }}
          className="flex items-center justify-center px-6"
        >
          <div className="text-center max-w-2xl mx-auto">
            <SectionEyebrow>Get In Touch</SectionEyebrow>
            <h2 className="text-4xl sm:text-6xl font-bold text-white font-poppins leading-tight mb-5">
              Let&apos;s build something
              <br />
              that ships.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-10">
              Open to roles, consulting, and interesting problems in AI, vision, and
              full-stack systems.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 text-white text-base font-medium rounded-2xl border border-sky-400/25 bg-sky-500/10 hover:bg-sky-500/20 transition-all hover:-translate-y-0.5"
            >
              Get in Touch
              <img src={arrow} alt="" className="w-4 h-4 object-contain" />
            </Link>
            <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:text-gray-300 transition-colors"
              >
                {personalInfo.email}
              </a>
              <span className="hidden sm:inline text-white/20">·</span>
              <span>{personalInfo.phone}</span>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Navigation Dots ─── */}
      <div
        style={{
          position: "fixed",
          bottom: isMobile ? "16px" : "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "10px" : "8px",
          zIndex: 100,
          padding: isMobile ? "10px 20px" : "10px 18px",
          borderRadius: "20px",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {PAGE_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => goToPage(i)}
            onMouseEnter={() => setHoveredDot(i)}
            onMouseLeave={() => setHoveredDot(null)}
            title={label}
            aria-label={label}
            aria-current={currentPage === i ? "page" : undefined}
            style={{
              position: "relative",
              width: currentPage === i ? (isMobile ? "24px" : "22px") : isMobile ? "8px" : "6px",
              height: isMobile ? "8px" : "6px",
              borderRadius: "4px",
              background: currentPage === i ? "#fff" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
              outline: "8px solid transparent",
            }}
          >
            {!isMobile && hoveredDot === i && (
              <span
                style={{
                  position: "absolute",
                  bottom: "18px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.7)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.05em",
                  pointerEvents: "none",
                }}
              >
                {label}
              </span>
            )}
          </button>
        ))}
      </div>

      {!isMobile && currentPage > 0 && (
        <button
          onClick={() => goToPage(currentPage - 1)}
          aria-label="Previous section"
          className="nav-arrow"
          style={{ left: "16px" }}
        >
          ‹
        </button>
      )}

      {!isMobile && currentPage < TOTAL_PAGES - 1 && (
        <button
          onClick={() => goToPage(currentPage + 1)}
          aria-label="Next section"
          className="nav-arrow"
          style={{ right: "16px" }}
        >
          ›
        </button>
      )}
    </div>
  );
};

export default Home;
