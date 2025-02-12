import React, { useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import OriginalChat from "../OriginalChat";
import ChatRecordBox from "../ChatRecordBox";
import ChatInput from "../ChatInput";
import { useChatStore } from "../../store";
import { Modal, Input, Switch, Button, Drawer, Radio, Space } from "antd";
// import { getMessageList } from "../../request/api";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PlusOutlined,
  SettingOutlined,
  VerticalLeftOutlined,
} from "@ant-design/icons";
const style = getStyleName("independent-dialog-box");

interface IProps {}

/**
 * 独立对话框组件
 * @param props
 */
const IndependentDialogBox = (props: IProps) => {
  const store = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState<string>("");
  const [currentBotId, setCurrentBotId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentStream, setCurrentStream] = useState<boolean>(false);
  const [isHistoryContract, setIsHistoryContract] = useState(false); // 是否收起左侧历史对话栏，默认不收起

  const onTokenChange = (e) => {
    setCurrentToken(e.target.value);
  };
  const onBotIdChange = (e) => {
    setCurrentBotId(e.target.value);
  };
  const onUserNameChange = (e) => {
    setCurrentUserName(e.target.value);
  };
  const onStreamChange = (value) => {
    setCurrentStream(value);
  };
  const onUserConfigSave = () => {
    store.setUserConfig({
      token: currentToken,
      botId: currentBotId,
      userName: currentUserName,
      stream: currentStream,
    });
    // 关闭
    setIsModalOpen(false);
  };

  const onModalOpen = () => {
    setCurrentToken(store.userConfig.token || "");
    setCurrentBotId(store.userConfig.botId || "");
    setCurrentUserName(store.userConfig.userName || "");
    setCurrentStream(store.userConfig.stream || false);
    setIsModalOpen(true);
  };

  // 点击历史对话
  const onCLickHistoryChat = async (item) => {
    // 如果 当前会话id 不等于 被点击的会话id，表示需要切换会话；否则表示点击的仍然是当前会话，此时不操作
    if (store.currentConversation !== item.conversationId) {
      store.setCurrentConversation(item.conversationId); // 将被点击的会话的id设为当前会话id
      store.setSwitchConversation(true); // 表示切换会话
      const messagesCache = store.switchConversationMessage.find(
        // 从【所有会话缓存】中取出【当前会话】对应的消息缓存
        (obj) => obj.conversationId === item.conversationId
      );
      if (messagesCache) {
        // 如果【当前会话的缓存】存在，用缓存信息更新【消息列表messages】
        const messages = messagesCache.message;
        store.setMessages([...messages]);
      }
      // else {
      //   const dataSwitchConversation = await getMessageList(item.conversationId)
      //   const filteredData = dataSwitchConversation.map(item => ({
      //   role: item.role,
      //   text: item.role === 'assistant' ? item.content : JSON.parse(item.content)[0].text,
      // }));
      // store.setMessages([...filteredData])
      // // console.log('new',{ conversationId: item.conversationId, message: [ ...filteredData ] })
      // store.setSwitchConversationMessage([...store.switchConversationMessage, { conversationId: item.conversationId, message: [ ...filteredData ] }])
      // }
    }
  };

  return (
    <div className={style("")}>
      {/* 历史对话栏 */}
      {!isHistoryContract && (
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
                  onCLickHistoryChat(item);
                }}
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className={style("left-settings")}>
            <div
              className={style("left-settings-setting")}
              onClick={onModalOpen}
            >
              <div className={style("left-settings-setting-icon")}>
                <SettingOutlined />
              </div>
              <div className={style("left-settings-setting-text")}>设置</div>
            </div>
            <div className={style("left-settings-icon")}>
              <Button
                variant="text"
                icon={<DoubleLeftOutlined />}
                size="small"
                onClick={() => {
                  setIsHistoryContract(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* 收缩历史对话栏 */}
      {isHistoryContract && (
        <div className={style("left-contract")}>
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              if (store.currentConversation) {
                store.setCurrentConversation("");
                store.setMessages([]);
              }
            }}
          />
          <Button
            icon={<DoubleRightOutlined />}
            size="small"
            onClick={() => {
              setIsHistoryContract(false);
            }}
          />
        </div>
      )}

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
        okText="Save"
      >
        <div>
          Personal Access Token
          <Input
            value={currentToken}
            placeholder="please enter your Coze Personal Access Token"
            className="token-botId"
            onChange={onTokenChange}
          />
        </div>
        <div>
          Bot ID
          <Input
            value={currentBotId}
            placeholder="please enter your BOT ID"
            className="token-botId"
            onChange={onBotIdChange}
          />
        </div>
        <div>
          User Name
          <Input
            value={currentUserName}
            placeholder="please enter your USER NAME"
            className="token-botId"
            onChange={onUserNameChange}
          />
        </div>
        <div>
          Stream
          <Switch
            checked={currentStream}
            defaultChecked
            className="switchStream"
            onChange={onStreamChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default IndependentDialogBox;
