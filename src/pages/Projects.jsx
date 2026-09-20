import { Link } from "react-router-dom";

import { CTA } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";

const Projects = () => {
  return (
    <section
      className="max-container"
      style={{ background: "#050505", minHeight: "100vh" }}
    >
      <p className="text-sky-400/90 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
        Portfolio
      </p>
      <h1 className="head-text text-white">
        Selected{" "}
        <span className="text-white drop-shadow font-semibold">Work</span>
      </h1>

      <p className="text-gray-400 mt-3 leading-relaxed max-w-2xl">
        Computer vision pipelines, AI systems, and real-time platforms — the
        projects I&apos;m most proud of.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
        {projects.map((project) => (
          <div
            key={project.name}
            className="rounded-2xl p-6 border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`block-container w-12 h-12`}>
                <div className={`btn-back rounded-xl ${project.theme}`} />
                <div className="btn-front rounded-xl flex justify-center items-center">
                  {project.iconUrl ? (
                    <img
                      src={project.iconUrl}
                      alt=""
                      className="w-1/2 h-1/2 object-contain"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {project.customIcon}
                    </span>
                  )}
                </div>
              </div>
              <h4 className="text-xl font-poppins font-semibold text-white">
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
              <div className="mt-5 flex items-center gap-2 font-poppins">
                <Link
                  to={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sky-400 hover:text-sky-300 transition-colors text-sm"
                >
                  View project
                </Link>
                <img src={arrow} alt="" className="w-4 h-4 object-contain" />
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="border-white/10" />
      <CTA />
    </section>
  );
};

export default Projects;
