import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../constants";

const ExperiencePoints = ({ points }) => (
  <ul className="my-4 space-y-2.5">
    {points.map((point, i) => (
      <li
        key={i}
        className="text-gray-400 text-xs sm:text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-sky-400/50"
      >
        {point}
      </li>
    ))}
  </ul>
);

const ExperienceTimeline = () => {
  return (
    <VerticalTimeline lineColor="rgba(255,255,255,0.06)">
      {experiences.map((experience) => (
        <VerticalTimelineElement
          key={`${experience.company_name}-${experience.date}`}
          date={experience.date}
          dateClassName="text-gray-500 !font-normal !text-sm"
          iconStyle={{ background: experience.iconBg }}
          icon={
            <div className="flex justify-center items-center w-full h-full rounded-full overflow-hidden">
              <img
                src={experience.icon}
                alt={experience.company_name}
                className="w-[70%] h-[70%] object-contain"
              />
            </div>
          }
          contentStyle={{
            borderBottom: "3px solid",
            borderBottomColor: experience.iconBg,
            boxShadow: "none",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "24px",
          }}
          contentArrowStyle={{ borderRight: "7px solid rgba(255,255,255,0.03)" }}
        >
          <div>
            <h3 className="text-white text-lg sm:text-xl font-poppins font-semibold">
              {experience.title}
            </h3>
            <p className="text-sky-400 font-medium text-sm" style={{ margin: 0 }}>
              {experience.company_name}
            </p>
            <p className="text-gray-500 text-xs mt-1">{experience.location}</p>
          </div>

          {experience.sections ? (
            <div className="mt-5 space-y-5">
              {experience.sections.map((section) => (
                <div key={section.title}>
                  <h4 className="text-white/90 text-sm font-semibold tracking-wide border-l-2 border-sky-400/40 pl-3 mb-2">
                    {section.title}
                  </h4>
                  <ExperiencePoints points={section.points} />
                </div>
              ))}
            </div>
          ) : (
            <ExperiencePoints points={experience.points} />
          )}
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default ExperienceTimeline;
