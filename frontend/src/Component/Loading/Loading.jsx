import React from "react";
import { infinity } from "ldrs";

infinity.register();

const LoadingScreen = () => {
  return (
    <div className="h-full w-full absolute top-0 left-0 flex flex-col items-center justify-center bg-zinc-900/90 z-50">
      <l-infinity
        size="90"
        stroke="4"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.3"
        color="#0eff00"
      ></l-infinity>
      <div className="mt-4 text-[#0eff00] text-3xl font-bold font-sans">
        QW Homes
      </div>
    </div>
  );
};

export default LoadingScreen;
