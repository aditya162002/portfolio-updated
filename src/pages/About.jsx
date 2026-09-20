import { CTA, ExperienceTimeline } from "../components";
import {
  skills,
  skillCategories,
  personalProjects,
  personalInfo,
  openSource,
} from "../constants";

const About = () => {
  return (
    <section
      className="max-container"
      style={{ background: "#050505", minHeight: "100vh" }}
    >
      <p className="text-sky-400/90 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
        About
      </p>
      <h1 className="head-text text-white">
        Hello, I&apos;m{" "}
        <span className="text-white font-semibold drop-shadow">
          {personalInfo.name}
        </span>
      </h1>

      <div className="mt-4 flex flex-col gap-2 text-gray-400 max-w-2xl">
        <p className="text-sky-400/80 text-sm font-medium">
          {personalInfo.title} · {personalInfo.tagline}
        </p>
        <p className="leading-relaxed">
          Building scalable full-stack systems, computer vision pipelines, and
          AI-powered products — from real-time multiplayer platforms to
          multi-country data intelligence.
        </p>
        <p className="text-gray-600 text-sm mt-1">
          {personalInfo.email} · {personalInfo.phone}
        </p>
      </div>

      <div className="py-12">
        <h3 className="subhead-text text-white">Education</h3>
        <div className="mt-6 max-w-xl rounded-2xl p-6 border border-white/[0.06] bg-white/[0.02]">
          <h4 className="text-white font-semibold text-lg">
            {personalInfo.education.degree}
          </h4>
          <p className="text-gray-300 mt-1">{personalInfo.education.university}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
            <span>{personalInfo.education.location}</span>
            <span>{personalInfo.education.duration}</span>
            <span>CGPA: {personalInfo.education.gpa}</span>
          </div>
        </div>
      </div>

      <div className="py-6 flex flex-col">
        <h3 className="subhead-text text-white">Core Stack</h3>
        <div className="mt-10 flex flex-wrap gap-8">
          {skills.map((skill) => (
            <div className="block-container w-20 h-20" key={skill.name}>
              <div className="btn-back rounded-xl" />
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-1/2 h-1/2 object-contain"
                  title={skill.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-10">
        <h3 className="subhead-text text-white">Technical Skills</h3>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <div className="py-14">
        <h3 className="subhead-text text-white">Work Experience</h3>
        <div className="mt-5 flex flex-col gap-3 text-gray-400">
          <p>
            Senior engineering at Backgammon Galaxy, AI consulting at Amplytic, and
            full-stack product work at Nineleaps.
          </p>
        </div>
        <div className="mt-10">
          <ExperienceTimeline />
        </div>
      </div>

      <div className="py-14">
        <h3 className="subhead-text text-white">Personal Projects</h3>
        <div className="mt-5 flex flex-col gap-3 text-gray-400">
          <p>Side projects and open-source work.</p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {personalProjects.map((project) => (
            <div
              key={project.name}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${project.accentColor}28`,
              }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="text-white text-xl font-semibold font-poppins flex items-center gap-2">
                    {project.name}
                    {project.github && (
                      <span
                        className="text-[10px] font-normal px-2 py-0.5 rounded-md uppercase tracking-wide"
                        style={{
                          background: `${project.accentColor}22`,
                          color: project.accentColor,
                        }}
                      >
                        open source
                      </span>
                    )}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">{project.tagline}</p>
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium transition-all hover:-translate-y-0.5"
                    style={{
                      background: `${project.accentColor}18`,
                      color: project.accentColor,
                      border: `1px solid ${project.accentColor}40`,
                    }}
                  >
                    View on GitHub
                  </a>
                )}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {project.description}
              </p>

              <ul className="list-disc ml-5 space-y-1">
                {project.highlights.map((h, i) => (
                  <li key={i} className="text-gray-400 text-sm">
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-1">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 rounded-md bg-white/[0.05] text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">
            Open Source Contributions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {openSource.map((item) => (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] hover:border-sky-400/20 transition-all"
              >
                <h4 className="text-white font-semibold">{item.name}</h4>
                <p className="text-gray-400 text-sm mt-2">{item.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-white/10" />
      <CTA />
    </section>
  );
};

export default About;
