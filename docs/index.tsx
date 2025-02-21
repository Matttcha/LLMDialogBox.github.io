import React from "react";
import { createRoot } from "react-dom/client";
import LLMDialogBox from "../src/index"; // 引入组件
import "./index.less";

const App = () => {
  return (
    <div className="container">
      <LLMDialogBox mode={0} />
    </div>
  );
};
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
