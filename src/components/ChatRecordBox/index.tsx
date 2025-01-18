import React, { useEffect, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import Message from "../Message";
import { IMessageInter } from "../../type";

const style = getStyleName("chat-record-box");

interface IProps {
  conversation: IMessageInter[];
}

/**
 * 聊天记录框
 * @param props
 */
const ChatRecordBox = (props: IProps) => {
  const { conversation } = props;
  const [messages, setMessages] = useState<IMessageInter[]>(conversation);
  console.log(messages);
  return (
    <div className={style("")}>
      {messages.map((message) => (
        <Message message={message} />
      ))}
    </div>
  );
};

export default ChatRecordBox;
