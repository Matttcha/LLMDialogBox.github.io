import React, { useEffect, useState, useRef, memo } from "react";
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
const ChatRecordBox = memo((props: IProps) => {
  const store = useChatStore();
  console.log("ChatRecordBox");
  // const currentConversationId = store.currentConversation;

  // useEffect(() => {
  //   // 只有【点击历史对话】的时候才会将store.switchConversation设为true，才能查询历史消息列表并更新messages
  //   if (store.switchConversation) {
  //     // const res = []; // 假如说这是接口返回的messages，因为接口还没写所以先用空数组mock一下
  //     // store.setMessages(res);
  //     // console.log(store.messages);
  //   }
  // }, [store.switchConversation]);

  const messagesRef = useRef<HTMLDivElement>(null);

  // 当消息列表更新时，滚动到底部
  useEffect(() => {
    console.log("滚动");
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [store.messages]);
  return (
    <div className={style("")} ref={messagesRef}>
      {store.messages.map((message, index) => (
        <Message
          key={index}
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
});

export default ChatRecordBox;
