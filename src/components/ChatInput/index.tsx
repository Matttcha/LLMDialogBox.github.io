import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { IconFile, IconFileImage, IconSend } from "@arco-design/web-react/icon";
import { Tooltip, Input } from "antd";
import FileUpload from "../FileUpload";

const { TextArea } = Input;

import { useChatStore } from "../../store";
import useConversation from "../../hooks/useConversation";

const style = getStyleName("chat-input");

interface IProps {}

interface IFileUploadRef {
  click: () => {};
}

/**
 * 对话输入框
 * @param props
 */
const ChatInput = (props: IProps) => {
  const store = useChatStore();
  const [input, setInput] = useState<string>("");
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { sendMessage } = useConversation();
  const fileUploadRef = useRef<IFileUploadRef>(null);

  // 当前对话切换时，清空文本框、图片列表、文件列表
  useEffect(() => {
    setInput("");
    setImageList([]);
    setFileList([]);
  }, [store.currentConversation]);

  // 上传文件成功
  const onUploadSuccess = (files) => {
    // 获取到文件列表files
    // 判断是图片类型还是文件类型，然后根据不同类型分别setImageList和setFileList 从而去渲染页面
  };

  return (
    <>
      <div className={style("")}>
        <div className={style("textarea")}>
          <div className={style("textarea-files")}>
            {imageList.map((img) => (
              <div className={style("textarea-files-img")}>
                <image />
              </div>
            ))}
            {fileList.map((file) => (
              <div className={style("textarea-files-file")}></div>
            ))}
          </div>
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
          <div
            className={style("btns-btn")}
            onClick={() => {
              fileUploadRef.current?.click();
            }}
          >
            <Tooltip title="上传文件">
              <IconFile />
            </Tooltip>
          </div>
          <div
            className={style("btns-btn")}
            onClick={() => {
              fileUploadRef.current?.click();
            }}
          >
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
      <FileUpload ref={fileUploadRef} onUploadSuccess={onUploadSuccess} />
    </>
  );
};

export default ChatInput;
