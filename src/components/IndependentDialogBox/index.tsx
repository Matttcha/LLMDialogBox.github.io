import React, { useEffect, useRef } from "react";
import "./index.less";
import getStyleName from "../../common/utils/getStyleName";
import OriginalChat from "../OriginalChat";
import ChatRecordBox from "../ChatRecordBox";
import ChatInput from "../ChatInput";

const style = getStyleName("independent-dialog-box");

const conversations = [
  {
    text: "你好",
  },
  {
    text: "介绍人工智能",
  },
  {
    text: "什么是布偶猫",
  },
];

interface IProps {}

/**
 * 独立对话框组件
 * @param props
 */
const IndependentDialogBox = (props: IProps) => {
  return (
    <div className={style("")}>
      <div className={style("left")}>
        <div className={style("left-title")}>
          <div className={style("left-title-icon")}>🐈</div>
          <div className={style("left-title-erc")}>邪恶布偶猫</div>
        </div>
        <div className={style("left-add-conversation")}>+ 新对话</div>
        <div className={style("left-history")}>历史对话</div>
        <div className={style("left-list")}>
          {conversations.map((item) => (
            <div className={style("left-list-item")}>{item.text}</div>
          ))}
        </div>
      </div>
      <div className={style("right")}>
        {/* <ChatRecordBox /> */}
        <OriginalChat />
        <ChatInput />
      </div>
    </div>
  );
};

export default IndependentDialogBox;
