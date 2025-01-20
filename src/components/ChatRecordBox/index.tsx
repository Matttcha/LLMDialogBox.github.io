import React, { useEffect, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import Message from "../Message";
import { useChatStore } from "../../store";
import useConversation from "../../hooks/useConversation";

const style = getStyleName("chat-record-box");

interface IProps {}

/**
 * 聊天记录框
 * @param props
 */
const ChatRecordBox = (props: IProps) => {
  const store = useChatStore();
  console.log("ChatRecordBox");
  const currentConversationId = store.currentConversation;

  useEffect(() => {
    // 查询历史消息列表并用setMessages更新messages
    const res = []; // 假如说这是接口返回的messages，因为接口还没写所以先用空数组mock一下
    store.setMessages(res);
    console.log(store.messages);
    
  }, [store.currentConversation]);

  return (
    <div className={style("")}>
      {store.messages.map((message, index) => (
        <Message
          message={message}
          showSuggestions={
            message.role === "assistant" &&
            index === store.messages.length - 1 &&
            message.suggestions &&
            message.suggestions.length > 0
          }
        ></Message>
      ))}
    </div>
  );
};

export default ChatRecordBox;
