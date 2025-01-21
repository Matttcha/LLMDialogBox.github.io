import React, { useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import OriginalChat from "../OriginalChat";
import ChatRecordBox from "../ChatRecordBox";
import ChatInput from "../ChatInput";
import { IconDoubleLeft, IconSettings } from "@arco-design/web-react/icon";
import { useChatStore } from "../../store";
import { Modal } from "antd";

const style = getStyleName("independent-dialog-box");

interface IProps {}

/**
 * 独立对话框组件
 * @param props
 */
const IndependentDialogBox = (props: IProps) => {
  const store = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            if (store.currentConversation) {
              store.setCurrentConversation("");
              store.setMessages([]);
            }
          }}
        >
          + 新会话
        </div>
        <div className={style("left-history")}>历史会话</div>
        <div className={style("left-list")}>
          {store.conversations.map((item) => (
            <div
              key={item.conversationId}
              className={`${style("left-list-item")} ${
                item.conversationId === store.currentConversation
                  ? style("left-list-item-active")
                  : ""
              }`}
              onClick={() => {
                if (store.currentConversation !== item.conversationId) {
                  store.setCurrentConversation(item.conversationId);
                  store.setSwitchConversation(true);
                }
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
        <div className={style("left-settings")}>
          <div className={style("left-settings-setting-icon")}>
            <IconSettings />
          </div>
          <div
            className={style("left-settings-setting-text")}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            设置
          </div>
          <div className={style("left-settings-icon")}>
            <IconDoubleLeft />
          </div>
        </div>
      </div>
      <div className={style("right")}>
        {!store.currentConversation ? <OriginalChat /> : <ChatRecordBox />}
        <ChatInput />
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <div></div>
        <div>456</div>
        <div>789</div>
      </Modal>
    </div>
  );
};

export default IndependentDialogBox;
