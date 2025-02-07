import React, { useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import OriginalChat from "../OriginalChat";
import ChatRecordBox from "../ChatRecordBox";
import ChatInput from "../ChatInput";
import { IconDoubleLeft, IconSettings } from "@arco-design/web-react/icon";
import { useChatStore } from "../../store";
import { Modal, Input, Switch } from "antd";

const style = getStyleName("independent-dialog-box");

interface IProps {}

/**
 * 独立对话框组件
 * @param props
 */
const IndependentDialogBox = (props: IProps) => {
  const store = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentToken,setCurrentToken] = useState<string>("")
  const [currentBotId, setCurrentBotId] = useState<string>("")
  const [currentUserName, setCurrentUserName] = useState<string>("")
  const [currentStream, setCurrentStream] = useState<boolean>(false)
  
  const onTokenChange = (e) => { setCurrentToken(e.target.value) }
  const onBotIdChange = (e) => {setCurrentBotId(e.target.value)}  
  const onUserNameChange = (e) => {setCurrentUserName(e.target.value)}  
  const onStreamChange = (value) => {setCurrentStream(value)}  
  const onUserConfigSave = () => {
    store.setUserConfig({
      token: currentToken,
      botId: currentBotId,
      userName: currentUserName,
      stream: currentStream,
    })
  }

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
        onOk={onUserConfigSave}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText='Save'
      >
        <div>
          Token
          <Input placeholder="请输入您的 Coze Token"  className="token-botId" onChange={onTokenChange}/>
        </div>
        <div>
          BotId
          <Input placeholder="请输入您的 BotId"  className="token-botId" onChange={onBotIdChange}/>
        </div>
        <div>
          用户名
          <Input placeholder="请输入您的用户名"  className="token-botId" onChange={onUserNameChange}/>
        </div>
        <div>
          流式响应
          <Switch defaultChecked className="switchStream" onChange={onStreamChange}/>
        </div>
      </Modal>
    </div>
  );
};

export default IndependentDialogBox;
