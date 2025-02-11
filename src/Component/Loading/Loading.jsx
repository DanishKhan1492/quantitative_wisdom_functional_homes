import React from "react"; // Updated CSS file name
import { cardio } from "ldrs";

cardio.register();

const LoadingScreen = () => {
  return (
    <div className="h-full w-full absolute top-0 left-0 flex items-center justify-center bg-zinc-900/90 z-50">
      <l-cardio size="120" stroke="8" speed="2" color="yellow"></l-cardio>
    </div>
  );
};

export default LoadingScreen;
