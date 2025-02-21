import React, { useState, useEffect, memo } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { useChatStore } from "../../store";
import useConversation from "../../hooks/useConversation";

const style = getStyleName("original-chat");

const data = [
  {
    title: "帮我分析这份文件",
    text: "轻松看懂当代消费者的大模型认知程度",
    question: "帮我分析这份文件",
    file: {},
  },
  {
    title: "看看这张图画了什么",
    text: "",
    question: "看看这张图画了什么",
    file: {},
  },
  {
    title: "这段代码怎么写",
    text: "用JavaScript实现一颗二叉树",
    question: "用JavaScript实现一颗二叉树",
    file: {},
  },
  {
    title: "介绍一下你自己",
    text: "你好，你是谁",
    question: "介绍一下你自己",
  },
];

interface IProps {}

/**
 * 初始状态对话框
 * @param props
 */
const OriginalChat = memo((props: IProps) => {
  console.log('OriginalChat')
  const store = useChatStore();
  const { sendMessage } = useConversation();

  return (
    <div className={style("")}>
      <div className={style("title")}>
        你好，我是{store.botInfo.name || "你的智能助手"}
      </div>
      <div className={style("des")}>
        {store.botInfo.description ||
          "作为你的智能伙伴，我能帮你分析文件、图片、写代码，又能陪你聊天、答疑解惑。"}
      </div>
      <div className={style("examples")}>
        {data.map((item) => (
          <div
            key={item.question}
            className={style("examples-example")}
            onClick={async () => {
              await sendMessage({ text: item.question });
            }}
          >
            <div className={style("examples-example-title")}>{item.title}</div>
            <div className={style("examples-example-text")}>{item.text}</div>
            {item.file && (
              <div className={style("examples-example-file")}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default OriginalChat;


