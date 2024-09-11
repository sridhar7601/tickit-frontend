import { useState } from "react";
import { MultiStepLoader as Loader } from "./multi-step-loaderComponent";
import { IconSquareRoundedX } from "@tabler/icons-react";

const loadingStates = [
  {
    text: "Locating the perfect seat...",
  },
  {
    text: "Unlocking your ideal spot...",
  },
  {
    text: "Assembling your dream reservation...",
  },
  {
    text: "Verifying seat magic...",
  },
  {
    text: "Calibrating your booking experience...",
  },
  {
    text: "Preparing your seat adventure...",
  },
  {
    text: "Making sure everything's just right...",
  },
  {
    text: "Almost ready! Confirming your exclusive spot...",
  },
];


 function MultiStepLoaderDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="w-full h-[4vh] flex items-center justify-center">
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={800} />

      {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
      <button
        onClick={() => setLoading(true)}
        className="text-white lack mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
        style={{
          boxShadow:
            "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
        }}
      >
Pay      </button>

      {loading && (
        <button
          className="fixed top-4 right-4 text-black dark:text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
export default MultiStepLoaderDemo;