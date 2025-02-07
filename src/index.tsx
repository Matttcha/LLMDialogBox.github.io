import React, { useEffect } from "react";
import IndependentDialogBox from "./components/IndependentDialogBox";
import InlineDialogBox from "./components/InlineDialogBox";
import { useChatStore } from "./store";
import { getBotInfo } from "./request/api";
import { botInfo } from "./mock";
// import '@ant-design/v5-patch-for-react-19';

const botId = "";

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
  const store = useChatStore();
  // 每次组件挂载时，调用该函数，获取智能助手的名字
  useEffect(() => {
    const fetchBotInfo = async () => {
      try {
        // const data = await getBotInfo(); // 暂时不用，先用mock数据，因为调用会超api调用限额
        const data = await botInfo;
        store.setBotInfo(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBotInfo();
  }, [botId]); // botId后续要改，这里只是暂时写一下

  return (
    <>
      {mode === DialogBoxMode.inline ? (
        <InlineDialogBox />
      ) : (
        <IndependentDialogBox />
      )}
    </>
  );
};

export default LLMDialogBox;
