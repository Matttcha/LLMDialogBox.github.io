import React, { useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import OriginalChat from "../OriginalChat";
import ChatRecordBox from "../ChatRecordBox";
import ChatInput from "../ChatInput";
import { IconDoubleLeft, IconSettings ,IconDoubleRight} from "@arco-design/web-react/icon";
import { useChatStore } from "../../store";
import { Modal, Input, Switch, Button, Drawer, Radio, Space } from "antd";
import { getMessageList } from "../../request/api"
import Icon, { PlusCircleOutlined, PlusOutlined  } from '@ant-design/icons';
const style = getStyleName("independent-dialog-box");

interface IProps { }

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
  const [open, setOpen] = useState(false);

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
    //关闭
    setIsModalOpen(false);
  };

  const onCLickHistoryChat = async (item) => {
    if (store.currentConversation !== item.conversationId) {
      store.setCurrentConversation(item.conversationId);
      store.setSwitchConversation(true);
      const foundObject = store.switchConversationMessage.find(obj => obj.conversationId === item.conversationId);
      console.log('store.switchConversationMessage', store.switchConversationMessage)
      console.log('item.conversationId', item.conversationId)
      console.log('foundObject', foundObject)
      if (foundObject) {
        const text = foundObject.message;
        store.setMessages([...text])
          // console.log(text); // 输出: bbbbb
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
      
      // console.log(dataSwitchConversation)
            // console.log(store.switchConversationMessage)
    }
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className={style("")}>
      
      {open&&<div className={style("left")}>
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
              className={`${style("left-list-item")} ${item.conversationId === store.currentConversation
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
          <div className={style("left-settings-setting-icon")}>
            <IconSettings />
          </div>
          <div
            className={style("left-settings-setting-text")}
            onClick={() => {
              setCurrentToken(store.userConfig.token || "");
              setCurrentBotId(store.userConfig.botId || "");
              setCurrentUserName(store.userConfig.userName || "");
              setCurrentStream(store.userConfig.stream || false);
              setIsModalOpen(true);
            }}
          >
            设置
          </div>
          <div className={style("left-settings-icon")} onClick={onClose}>
            <IconDoubleLeft />
          </div>
        </div>
      </div>}
      

      {open || <div className={style("left-contract")}>
        <div className={style("left-contract-newConversationBtn")}>
          <Button className={style("left-contract-newConversationBtn-btn")} onClick={() => {
            if (store.currentConversation) {
              store.setCurrentConversation("");
              store.setMessages([]);
            }
          }}>
            <div className={style("left-contract-newConversationBtn-btn-plus")}>
                <PlusOutlined />
            </div>
            
          </Button>
        </div>
        <div className={style("left-contract-settings-icon")} onClick={() => {
          setOpen(true);
          }}>
          <IconDoubleRight />
        </div>
      </div>}




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
          Token
          <Input
            value={currentToken}
            placeholder="请输入您的 Coze Token"
            className="token-botId"
            onChange={onTokenChange}
          />
        </div>
        <div>
          BotId
          <Input
            value={currentBotId}
            placeholder="请输入您的 BotId"
            className="token-botId"
            onChange={onBotIdChange}
          />
        </div>
        <div>
          用户名
          <Input
            value={currentUserName}
            placeholder="请输入您的用户名"
            className="token-botId"
            onChange={onUserNameChange}
          />
        </div>
        <div>
          流式响应
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
