import { Link } from "react-router-dom";
import { arrow } from "../assets/icons";

const HomeInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <div className="text-center px-6 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-md mx-auto">
        <h1 className="text-white text-lg sm:text-xl font-semibold font-poppins leading-snug">
          Hi, I'm{" "}
          <span className="typewriter-name">Aditya Bhadauria</span>{" "}
          👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Full Stack Engineer from India 🇮🇳
        </p>
      </div>
    );

  if (currentStage === 2) {
    return (
      <div className="text-center px-6 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-md mx-auto">
        <p className="text-gray-300 text-sm sm:text-base">
          Founding engineer at startups, building at scale.
        </p>
        <p className="text-gray-500 text-xs mt-2">↓ Scroll to explore</p>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div className="text-center px-6 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-md mx-auto">
        <p className="text-gray-300 text-sm sm:text-base">
          From real-time multiplayer to AI pipelines.
        </p>
        <p className="text-gray-500 text-xs mt-2">↓ See my work below</p>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div className="text-center px-6 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-md mx-auto">
        <p className="text-gray-300 text-sm sm:text-base">
          Need a project done or looking for a dev?
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 mt-3 px-5 py-2 text-sm text-white bg-blue-500/15 border border-blue-500/30 rounded-lg hover:bg-blue-500/25 transition-all"
        >
          Let's talk
          <img src={arrow} alt="arrow" className="w-3 h-3 object-contain" />
        </Link>
      </div>
    );
  }

  return null;
};

export default HomeInfo;
