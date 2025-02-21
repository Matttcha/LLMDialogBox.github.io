import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import LLMDialogBox from "../src/index"; // 引入组件
import "./index.less";
import { FloatButton } from "antd";

const App = () => {
  const [mode, setMode] = useState(0);
  return (
    <>
      <FloatButton
        description={mode === 0 ? "独立对话框" : "内联对话框"}
        tooltip="点击切换对话框模式"
        shape="square"
        onClick={() => {
          setMode(mode === 0 ? 1 : 0);
        }}
      ></FloatButton>
      <div className="container">
        <LLMDialogBox mode={mode} />
      </div>
    </>
  );
};
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<App />);
