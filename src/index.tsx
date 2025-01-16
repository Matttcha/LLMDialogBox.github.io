import React from "react";
import IndependentDialogBox from "./components/IndependentDialogBox";
import InlineDialogBox from "./components/InlineDialogBox";

/**
 * 对话框形态
 * @independent 独立对话框
 * @inline 内联形态
 */
enum DialogBoxMode {
  independent = 0,
  inline = 1,
}

interface IProps {
  mode: DialogBoxMode;
}

/**
 * LLM对话框组件
 * @param props
 * @constructor
 */
const LLMDialogBox = (props: IProps) => {
  const { mode } = props;
  return (
    <>
      {mode === DialogBoxMode.inline ? <InlineDialogBox /> : <IndependentDialogBox />}
    </>
  );
};

export default LLMDialogBox;
