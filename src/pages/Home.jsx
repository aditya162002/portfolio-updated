import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { HomeInfo, Loader } from "../components";
import { ComputerRoom } from "../models";
import { experiences, skills, projects, personalInfo, personalProjects } from "../constants";
import { arrow } from "../assets/icons";

import "react-vertical-timeline-component/style.min.css";

const PAGE_LABELS = ["Home", "About", "Experience", "Projects", "Portfolio", "Contact"];
const TOTAL_PAGES = PAGE_LABELS.length;

const Home = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const outerRef    = useRef(null);
  const sectionRefs = useRef([]);
  const pageRef     = useRef(0);        // always-current page, no stale closure
  // Gesture state: one scroll gesture = one page move
  const gesture     = useRef({ handled: false, timer: null });

  // keep pageRef in sync
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ── Navigate — just set state, CSS transform does the rest ──
  const goToPage = useCallback((index) => {
    setCurrentPage(Math.max(0, Math.min(index, TOTAL_PAGES - 1)));
  }, []);

  // ── Wheel: one gesture = one page ──
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onWheel = (e) => {
      const g = gesture.current;

      // Reset "handled" flag after 200ms of no wheel events (= gesture ended)
      clearTimeout(g.timer);
      g.timer = setTimeout(() => { g.handled = false; }, 200);

      // If section has room to scroll in that direction → let it, don't navigate
      const section = sectionRefs.current[pageRef.current];
      if (section && section.scrollHeight > section.clientHeight + 2) {
        const atTop    = section.scrollTop <= 1;
        const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 2;
        if (e.deltaY > 0 && !atBottom) return; // let section scroll
        if (e.deltaY < 0 && !atTop)    return; // let section scroll
      }

      // Block default browser scroll on the outer wrapper
      e.preventDefault();

      // Already navigated once this gesture — swallow remaining events
      if (g.handled) return;
      g.handled = true;

      goToPage(pageRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    outer.addEventListener("wheel", onWheel, { passive: false });
    return () => outer.removeEventListener("wheel", onWheel);
  }, [goToPage]); // runs once — all state via refs

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goToPage(pageRef.current + 1);
      if (e.key === "ArrowLeft")  goToPage(pageRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPage]);

  const getModelConfig = () => {
    const w = window.innerWidth;
    if (w < 480)  return { scale: [0.55,0.55,0.55], position:[0,-0.5,0], fov:50, cameraPos:[0,1,7] };
    if (w < 768)  return { scale: [0.65,0.65,0.65], position:[0,-0.5,0], fov:48, cameraPos:[0,1,7] };
    if (w < 1024) return { scale: [0.75,0.75,0.75], position:[0,-0.5,0], fov:45, cameraPos:[0,1,7] };
    return            { scale: [0.85,0.85,0.85], position:[0,-0.5,0], fov:45, cameraPos:[0,1,7] };
  };
  const modelConfig = getModelConfig();

  // Shared page style
  const pageStyle = {
    width: "100vw",
    minWidth: "100vw",
    height: "100vh",
    flexShrink: 0,
  };

  return (
    <div
      ref={outerRef}
      style={{ position: "fixed", inset: 0, background: "black", overflow: "hidden" }}
    >
      {/* ── Sliding track (CSS transform, no native scroll) ── */}
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
          style={{ ...pageStyle, overflow: "hidden", position: "relative", background: "black", touchAction: "none" }}
        >
          <div
            className="absolute left-0 right-0 z-10 flex items-center justify-center px-4"
            style={{ top: isMobile ? "64px" : "90px" }}
          >
            {currentStage && <HomeInfo currentStage={currentStage} />}
          </div>

          {isMobile && (
            <div className="absolute bottom-14 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="text-gray-400 text-xs tracking-wide">👆 Touch &amp; drag to rotate</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-gray-400 text-xs tracking-wide">Tap dots to navigate</span>
              </div>
            </div>
          )}

          <Canvas
            className={`w-full h-full ${isRotating ? "cursor-grabbing" : "cursor-grab"}`}
            camera={{ near:0.1, far:1000, position:modelConfig.cameraPos, fov:modelConfig.fov }}
            style={{ background: "black", touchAction: "none" }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
          >
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5,8,5]} intensity={1.8} color="#ffffff" />
              <directionalLight position={[-3,4,-3]} intensity={0.5} color="#4a90e2" />
              <hemisphereLight skyColor="#1a1a2e" groundColor="#000000" intensity={0.3} />
              <ComputerRoom
                isRotating={isRotating}
                setIsRotating={setIsRotating}
                setCurrentStage={setCurrentStage}
                position={modelConfig.position}
                rotation={[0,0,0]}
                scale={modelConfig.scale}
              />
            </Suspense>
          </Canvas>

          <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2 pointer-events-none select-none">
            <span className="text-white/30 text-xs tracking-widest uppercase">Swipe</span>
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </section>

        {/* ─── PAGE 1 : About ─── */}
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "black" }}
          className="px-6 sm:px-16 py-20"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">About Me</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins leading-tight">Code. Create. Innovate.</h2>
              <div className="mt-6 max-w-2xl mx-auto">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {personalInfo.title} with 3+ years building scalable full-stack systems — from real-time multiplayer platforms to AI-powered data pipelines.
                </p>
                <p className="text-gray-500 text-sm mt-3">{personalInfo.email}&nbsp;·&nbsp;{personalInfo.phone}</p>
              </div>
            </div>

            <div className="mb-16">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-6 text-center">Education</p>
              <div className="max-w-xl mx-auto rounded-2xl p-8 border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{personalInfo.education.degree}</h4>
                    <p className="text-gray-300 mt-1">{personalInfo.education.university}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span>{personalInfo.education.location}</span>
                      <span>{personalInfo.education.duration}</span>
                      <span>CGPA: {personalInfo.education.gpa}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-6 text-center">Tech Stack</p>
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center max-w-3xl mx-auto">
                {skills.map((skill) => (
                  <div className="group relative" key={skill.name}>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/5 hover:scale-110">
                      <img src={skill.imageUrl} alt={skill.name} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PAGE 2 : Experience ─── */}
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "black" }}
          className="px-6 sm:px-16 py-20"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Career</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins">Work Experience</h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
                From founding engineer roles at startups to enterprise software — here's my journey.
              </p>
            </div>
            <VerticalTimeline lineColor="rgba(255,255,255,0.06)">
              {experiences.map((experience) => (
                <VerticalTimelineElement
                  key={experience.company_name}
                  date={experience.date}
                  dateClassName="text-gray-500 !font-normal !text-sm"
                  iconStyle={{ background: experience.iconBg }}
                  icon={
                    <div className="flex justify-center items-center w-full h-full rounded-full overflow-hidden">
                      <img src={experience.icon} alt={experience.company_name} className="w-[70%] h-[70%] object-contain" />
                    </div>
                  }
                  contentStyle={{
                    borderBottom: "4px solid", borderBottomColor: experience.iconBg,
                    boxShadow: "none", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px",
                  }}
                  contentArrowStyle={{ borderRight: "7px solid rgba(255,255,255,0.03)" }}
                >
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-poppins font-semibold">{experience.title}</h3>
                    <p className="text-blue-400 font-medium text-sm" style={{ margin: 0 }}>{experience.company_name}</p>
                    <p className="text-gray-500 text-xs mt-1">{experience.location}</p>
                  </div>
                  <ul className="my-5 space-y-2.5">
                    {experience.points.map((point, i) => (
                      <li key={i} className="text-gray-400 text-xs sm:text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-500/40">
                        {point}
                      </li>
                    ))}
                  </ul>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </div>
        </section>

        {/* ─── PAGE 3 : Personal Projects ─── */}
        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "black" }}
          className="px-6 sm:px-16 py-20"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">Open Source</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins">Personal Projects</h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
                Side projects I've built out of curiosity — open source and shipping.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              {personalProjects.map((project) => (
                <a
                  key={project.name}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${project.accentColor}33`,
                    boxShadow: `0 0 32px ${project.accentColor}11`,
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: `${project.accentColor}22` }}>
                    🔷
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white text-lg sm:text-xl font-semibold font-poppins group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: `${project.accentColor}22`, color: project.accentColor }}>open source</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{project.tagline}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-[11px] px-2.5 py-0.5 rounded-md border border-white/5 text-gray-400" style={{ background: "rgba(255,255,255,0.03)" }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 text-sm font-medium" style={{ color: project.accentColor }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                    </svg>
                    GitHub →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PAGE 4 : Portfolio ─── */}
        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          style={{ ...pageStyle, overflowY: "auto", background: "black" }}
          className="px-6 sm:px-16 py-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white font-poppins">Highlights</h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Scalable platforms, AI-powered systems, and real-time applications — built with end-to-end ownership and a focus on performance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.name} className="group rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/10 transition-all duration-300 flex flex-col">
                  <div className="mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center">
                      {project.iconUrl
                        ? <img src={project.iconUrl} alt={project.name} className="w-5 h-5 object-contain" />
                        : <span className="text-blue-400 text-sm font-bold">{project.customIcon}</span>
                      }
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white font-poppins group-hover:text-blue-300 transition-colors">{project.name}</h4>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed flex-grow">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 text-[11px] text-gray-400 rounded-md bg-white/[0.03] border border-white/5">{tech}</span>
                    ))}
                  </div>
                  {project.link && project.link !== "#" && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View Project
                      <img src={arrow} alt="arrow" className="w-3 h-3 object-contain" />
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
          style={{ ...pageStyle, overflowY: "auto", background: "black" }}
          className="flex items-center justify-center px-6"
        >
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Get In Touch</p>
            <h2 className="text-4xl sm:text-6xl font-bold text-white font-poppins leading-tight mb-6">
              Have a project<br />in mind?
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-10">Let's build something great together.</p>
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 text-white text-base font-medium rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-105">
              Get in Touch
              <img src={arrow} alt="arrow" className="w-4 h-4 object-contain" />
            </Link>
            <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <a href="mailto:adityabhadauria162002@gmail.com" className="hover:text-gray-300 transition-colors">{personalInfo.email}</a>
              <span className="hidden sm:inline">·</span>
              <span>{personalInfo.phone}</span>
            </div>
          </div>
        </section>

      </div>
      {/* ── end track ── */}

      {/* ─── Navigation Dots ─── */}
      <div style={{
        position: "fixed", bottom: isMobile ? "16px" : "24px", left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: isMobile ? "10px" : "8px", zIndex: 100,
        padding: isMobile ? "10px 20px" : "8px 16px", borderRadius: "20px",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        {PAGE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            title={label}
            style={{
              /* larger hit-area on mobile via padding trick */
              width: currentPage === i ? (isMobile ? "24px" : "20px") : (isMobile ? "8px" : "6px"),
              height: isMobile ? "8px" : "6px",
              borderRadius: "4px",
              background: currentPage === i ? "white" : "rgba(255,255,255,0.3)",
              border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0,
              /* larger invisible tap zone on mobile */
              outline: "8px solid transparent",
            }}
          />
        ))}
      </div>

      {/* ─── Left Arrow — desktop only ─── */}
      {!isMobile && currentPage > 0 && (
        <button onClick={() => goToPage(currentPage - 1)} style={{
          position:"fixed", left:"16px", top:"50%", transform:"translateY(-50%)", zIndex:100,
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"50%", width:"44px", height:"44px", display:"flex",
          alignItems:"center", justifyContent:"center", cursor:"pointer",
          color:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", fontSize:"22px", lineHeight:1,
        }}>‹</button>
      )}

      {/* ─── Right Arrow — desktop only ─── */}
      {!isMobile && currentPage < TOTAL_PAGES - 1 && (
        <button onClick={() => goToPage(currentPage + 1)} style={{
          position:"fixed", right:"16px", top:"50%", transform:"translateY(-50%)", zIndex:100,
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"50%", width:"44px", height:"44px", display:"flex",
          alignItems:"center", justifyContent:"center", cursor:"pointer",
          color:"rgba(255,255,255,0.6)", backdropFilter:"blur(8px)", fontSize:"22px", lineHeight:1,
        }}>›</button>
      )}


    </div>
  );
};

export default Home;
