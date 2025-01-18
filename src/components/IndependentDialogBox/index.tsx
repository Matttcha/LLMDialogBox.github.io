import React, { useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import OriginalChat from "../OriginalChat";
import ChatRecordBox from "../ChatRecordBox";
import ChatInput from "../ChatInput";
import { IconDoubleLeft, IconSettings } from "@arco-design/web-react/icon";
import { useChatStore } from "../../store";
import { IMessageInter } from "../../type";

const style = getStyleName("independent-dialog-box");

interface IProps {}

/**
 * 独立对话框组件
 * @param props
 */
const IndependentDialogBox = (props: IProps) => {
  const [isNewConversation, setIsNewConversation] = useState<Boolean>(true);
  const [currentConversation, setCurrentConversation] = useState<
    IMessageInter[]
  >([]);
  const store = useChatStore();

  return (
    <div className={style("")}>
      <div className={style("left")}>
        <div className={style("left-title")}>
          <div className={style("left-title-icon")}>🐈</div>
          <div className={style("left-title-erc")}>邪恶布偶猫</div>
        </div>
        <div
          className={style("left-add-conversation")}
          onClick={() => {
            setIsNewConversation(true);
          }}
        >
          + 新对话
        </div>
        <div className={style("left-history")}>历史对话</div>
        <div className={style("left-list")}>
          {store.conversations.map((item) => (
            <div
              className={style("left-list-item")}
              onClick={() => {
                setIsNewConversation(false);
                setCurrentConversation(item);
              }}
            >
              {item[0].text}
            </div>
          ))}
        </div>
        <div className={style("left-settings")}>
          <div className={style("left-settings-setting-icon")}>
            <IconSettings />
          </div>
          <div className={style("left-settings-setting-text")}>设置</div>
          <div className={style("left-settings-icon")}>
            <IconDoubleLeft />
          </div>
        </div>
      </div>
      <div className={style("right")}>
        {isNewConversation ? (
          <OriginalChat />
        ) : (
          <ChatRecordBox conversation={currentConversation} />
        )}
        <ChatInput />
      </div>
    </div>
  );
};

export default IndependentDialogBox;
