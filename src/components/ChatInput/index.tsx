import React, { useEffect, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { IconFile, IconFileImage, IconSend } from "@arco-design/web-react/icon";
import { Tooltip, Input } from "antd";

const { TextArea } = Input;

import { useChatStore } from "../../store";
import useConversation from "../../hooks/useConversation";

const style = getStyleName("chat-input");

interface IProps {}

/**
 * 对话输入框
 * @param props
 */
const ChatInput = (props: IProps) => {
  const store = useChatStore();
  const [input, setInput] = useState<string>("");
  const { sendMessage } = useConversation();

  // 当前对话切换时，清空文本框
  useEffect(() => {
    setInput("");
  }, [store.currentConversation]);

  return (
    <div className={style("")}>
      <div className={style("textarea")}>
        <TextArea
          placeholder="Enter something"
          style={{ height: 80, width: 510 }}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </div>
      <div className={style("btns")}>
        <div className={style("btns-btn")}>
          <Tooltip title="上传文件">
            <IconFile />
          </Tooltip>
        </div>
        <div className={style("btns-btn")}>
          <Tooltip title="上传图片">
            <IconFileImage />
          </Tooltip>
        </div>
        <div
          className={`${style("btns-btn")} ${style("btns-send")}`}
          onClick={async () => {
            await sendMessage({ text: input });
          }}
        >
          <IconSend className={style("btns-btn-send")} />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
