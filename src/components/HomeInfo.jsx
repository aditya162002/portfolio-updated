import { Link } from "react-router-dom";
import { arrow } from "../assets/icons";

const Card = ({ children }) => (
  <div className="text-center px-5 py-4 sm:px-7 sm:py-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 mx-4 sm:mx-0 sm:max-w-md sm:mx-auto">
    {children}
  </div>
);

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <Card>
        <h1 className="text-white text-xl sm:text-2xl font-semibold font-poppins leading-snug">
          Hi, I'm{" "}
          <span className="typewriter-name">Aditya Bhadauria</span>{" "}
          👋
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1 font-light">
          Full Stack Engineer from India 🇮🇳
        </p>
      </Card>
    );

  if (currentStage === 2)
    return (
      <Card>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          Founding engineer at startups,
        </p>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          building at scale.
        </p>
        <p className="text-gray-500 text-xs mt-2 tracking-wide">› swipe to explore</p>
      </Card>
    );

  if (currentStage === 3)
    return (
      <Card>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          From real-time multiplayer
        </p>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          to AI pipelines.
        </p>
        <p className="text-gray-500 text-xs mt-2 tracking-wide">› swipe to see projects</p>
      </Card>
    );

  if (currentStage === 4)
    return (
      <Card>
        <p className="text-gray-200 text-base sm:text-lg font-medium">
          Need a project done or looking for a dev?
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 mt-3 px-5 py-2 text-sm sm:text-base text-white bg-blue-500/15 border border-blue-500/30 rounded-lg hover:bg-blue-500/25 transition-all"
        >
          Let's talk
          <img src={arrow} alt="arrow" className="w-3 h-3 object-contain" />
        </Link>
      </Card>
    );

  return null;
};

export default HomeInfo;
