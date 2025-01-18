import React from "react";
import "./index.less";
import getStyleName from "../../common/utils/getStyleName";

const style = getStyleName("original-chat");

const data = [
  {
    title: "帮我分析这份文件",
    text: "轻松看懂当代消费者的大模型认知程度",
    file: {},
  },
  {
    title: "看看这张图画了什么",
    text: "",
    file: {},
  },
  {
    title: "这段代码怎么写",
    text: "用JavaScript实现一颗二叉树",
    file: {},
  },
  {
    title: "介绍一下你自己",
    text: "你好，你是谁",
  },
];

interface IProps {}

/**
 * 初始状态对话框
 * @param props
 */
const OriginalChat = (props: IProps) => {
  return (
    <div className={style("")}>
      <div className={style("title")}>你好，我是邪恶布偶猫</div>
      <div className={style("des")}>
        作为你的智能伙伴，我能帮你分析文件、图片、写代码，又能陪你聊天、答疑解惑。
      </div>
      <div className={style("examples")}>
        {data.map((item) => (
          <div className={style("examples-example")}>
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
};

export default OriginalChat;
