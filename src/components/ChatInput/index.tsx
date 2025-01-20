import React from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { IconFile, IconFileImage, IconSend } from "@arco-design/web-react/icon";
import { Tooltip, Input } from "@arco-design/web-react";
import { useChatStore } from "../../store";
import useConversation from "../../hooks/useConversation";

const TextArea = Input.TextArea;

const style = getStyleName("chat-input");

interface IProps {}

/**
 * 对话输入框
 * @param props
 */
const ChatInput = (props: IProps) => {
  const store = useChatStore();
  const { sendMessage } = useConversation();

  return (
    <div className={style("")}>
      <div className={style("textarea")}>
        <TextArea
          placeholder="Enter something"
          style={{ height: 80, width: 500, border: "none" }}
        />
      </div>
      <div className={style("btns")}>
        <div className={style("btns-btn")}>
          <Tooltip content="上传文件" mini>
            <IconFile />
          </Tooltip>
        </div>
        <div className={style("btns-btn")}>
          <IconFileImage />
        </div>
        <div
          className={`${style("btns-btn")} ${style("btns-send")}`}
          onClick={async () => {
            await sendMessage({ text: "介绍一下布偶猫吧" });
          }}
        >
          <IconSend className={style("btns-btn-send")} />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
