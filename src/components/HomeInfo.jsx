import { Link } from "react-router-dom";
import { arrow } from "../assets/icons";
import { personalInfo } from "../constants";

const Card = ({ children }) => (
  <div className="text-center px-5 py-4 sm:px-8 sm:py-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 mx-4 sm:mx-0 sm:max-w-md sm:mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
    {children}
  </div>
);

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <Card>
        <h1 className="text-white text-xl sm:text-2xl font-semibold font-poppins leading-snug">
          Hi, I&apos;m{" "}
          <span className="typewriter-name">{personalInfo.name}</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-light">
          {personalInfo.title} · {personalInfo.location}
        </p>
      </Card>
    );

  if (currentStage === 2)
    return (
      <Card>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          Computer vision, AI systems,
        </p>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          and full-stack at scale.
        </p>
        <p className="text-gray-500 text-xs mt-2 tracking-wide">› scroll to explore</p>
      </Card>
    );

  if (currentStage === 3)
    return (
      <Card>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          From match transcription pipelines
        </p>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          to multi-country data agents.
        </p>
        <p className="text-gray-500 text-xs mt-2 tracking-wide">› scroll to see projects</p>
      </Card>
    );

  if (currentStage === 4)
    return (
      <Card>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          Looking for a senior engineer?
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 mt-3 px-5 py-2 text-sm sm:text-base text-white bg-sky-500/15 border border-sky-400/30 rounded-lg hover:bg-sky-500/25 transition-all"
        >
          Let&apos;s talk
          <img src={arrow} alt="" className="w-3 h-3 object-contain" />
        </Link>
      </Card>
    );

  return null;
};

export default HomeInfo;
