import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-24 h-24">
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: "#00c6ff",
              borderRightColor: "#0072ff",
              animation: "spin 1s linear infinite",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent"
            style={{
              borderBottomColor: "#00c6ff",
              borderLeftColor: "#0072ff",
              animation: "spin 1.5s linear infinite reverse",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-semibold font-poppins">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-40 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(to right, #00c6ff, #0072ff)",
            }}
          />
        </div>

        <p className="text-gray-400 text-xs font-poppins tracking-widest uppercase">
          cooking...
        </p>
      </div>
    </Html>
  );
};

export default Loader;
