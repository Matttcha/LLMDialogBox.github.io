import React, { useEffect, useRef } from "react";
import "./index.less";
import getStyleName from "../../common/utils/getStyleName";
import Message from "../Message";

const style = getStyleName("chat-record-box");

interface IProps {}

/**
 * 聊天记录框
 * @param props
 */
const ChatRecordBox = (props: IProps) => {
  return (
    <div className={style("")}>
      <Message
        type="user"
        imgs={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        files={[1, 2, 3]}
      />
      <Message type="assistant" />
      <Message
        type="user"
        imgs={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        files={[1, 2, 3]}
      />
      <Message type="assistant" />
      <Message
        type="user"
        imgs={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        files={[1, 2, 3]}
      />
      <Message type="assistant" />
    </div>
  );
};

export default ChatRecordBox;
