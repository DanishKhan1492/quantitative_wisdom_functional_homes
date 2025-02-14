import React from "react"; // Updated CSS file name
import { infinity } from "ldrs";

infinity.register();

const LoadingScreen = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <l-infinity
        size="90"
        stroke="4"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.3"
        color="#0eff00"
      ></l-infinity>
      
    </div>
  );
};

export default LoadingScreen;
