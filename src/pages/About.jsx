import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { CTA } from "../components";
import { experiences, skills, personalProjects } from "../constants";

import "react-vertical-timeline-component/style.min.css";

const About = () => {
  return (
    <section className='max-container' style={{ background: 'linear-gradient(rgb(0, 0, 0), rgb(10, 10, 10))', minHeight: "100vh" }}>
      <h1 className='head-text text-white'>
        Hello, I'm{" "}
        <span className='text-white font-semibold drop-shadow'>
          {" "}
          Aditya Bhadauria
        </span>{" "}
        👋
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-gray-300'>
        <p>
          Software Engineer based in India
        </p>
      </div>

      <div className='py-10 flex flex-col'>
        <h3 className='subhead-text text-white'>My Skills</h3>

        <div className='mt-16 flex flex-wrap gap-12'>
          {skills.map((skill) => (
            <div className='block-container w-20 h-20' key={skill.name}>
              <div className='btn-back rounded-xl' />
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='py-16'>
        <h3 className='subhead-text text-white'>Work Experience.</h3>
        <div className='mt-5 flex flex-col gap-3 text-gray-300'>
          <p>
            I've worked with all sorts of companies, leveling up my skills and
            teaming up with smart people. Here's the rundown:
          </p>
        </div>

        <div className='mt-12 flex'>
          <VerticalTimeline>
            {experiences.map((experience, index) => (
              <VerticalTimelineElement
                key={experience.company_name}
                date={experience.date}
                iconStyle={{ background: experience.iconBg }}
                icon={
                  <div className='flex justify-center items-center w-full h-full'>
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className='w-[60%] h-[60%] object-contain'
                    />
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: "none",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "white"
                }}
              >
                <div>
                  <h3 className='text-white text-xl font-poppins font-semibold'>
                    {experience.title}
                  </h3>
                  <p
                    className='text-gray-300 font-medium text-base'
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2'>
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className='text-gray-400 font-normal pl-1 text-sm'
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      {/* ── Personal Projects ── */}
      <div className='py-16'>
        <h3 className='subhead-text text-white'>Personal Projects.</h3>
        <div className='mt-5 flex flex-col gap-3 text-gray-300'>
          <p>Side projects I've built out of curiosity — open source and shipping.</p>
        </div>

        <div className='mt-10 flex flex-col gap-8'>
          {personalProjects.map((project) => (
            <div
              key={project.name}
              className='rounded-2xl p-6 flex flex-col gap-4'
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${project.accentColor}44`,
                boxShadow: `0 0 24px ${project.accentColor}22`,
              }}
            >
              {/* Header row */}
              <div className='flex items-start justify-between gap-4 flex-wrap'>
                <div>
                  <h4 className='text-white text-xl font-semibold font-poppins flex items-center gap-2'>
                    🔷 {project.name}
                    <span
                      className='text-xs font-normal px-2 py-0.5 rounded-full'
                      style={{ background: `${project.accentColor}33`, color: project.accentColor }}
                    >
                      open source
                    </span>
                  </h4>
                  <p className='text-gray-400 text-sm mt-1'>{project.tagline}</p>
                </div>
                <a
                  href={project.github}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium transition-all hover:scale-105'
                  style={{
                    background: `${project.accentColor}22`,
                    color: project.accentColor,
                    border: `1px solid ${project.accentColor}55`,
                  }}
                >
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12' />
                  </svg>
                  View on GitHub
                </a>
              </div>

              {/* Description */}
              <p className='text-gray-300 text-sm leading-relaxed'>{project.description}</p>

              {/* Highlights */}
              <ul className='list-disc ml-5 space-y-1'>
                {project.highlights.map((h, i) => (
                  <li key={i} className='text-gray-400 text-sm'>{h}</li>
                ))}
              </ul>

              {/* Tech pills */}
              <div className='flex flex-wrap gap-2 mt-1'>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className='text-xs px-3 py-1 rounded-full'
                    style={{ background: "rgba(255,255,255,0.07)", color: "#d1d5db" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className='border-gray-700' />

      <CTA />
    </section>
  );
};

export default About;
