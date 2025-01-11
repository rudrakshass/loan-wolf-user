import React from "react";
import { HashLoader } from "react-spinners";

const Loading: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="white" />
    </div>
  );
};

export default Loading;
