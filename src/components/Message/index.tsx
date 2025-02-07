import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { useChatStore } from "../../store";
import { IMessage } from "../../type";
import { Skeleton } from "antd";
import useConversation from "../../hooks/useConversation";
import Markdown from "../Markdown";

const style = getStyleName("message");

interface IProps {
  message: IMessage;
  showSuggestions?: boolean;
}


/**
 * 对话消息组件：分为【用户提问】和【智能助手答复】
 * @param props
 */
const Message = (props: IProps) => {
  const { message, showSuggestions = false } = props;
  const { role, text, suggestions = [], files, images } = message;
  const store = useChatStore();
  const { sendMessage } = useConversation();
  return (
    <div className={style("")}>
      {/* 头像 */}
      <div
        className={`${style("avatar")} ${
          role === "assistant" ? style("avatar-assistant") : ""
        }`}
      >
        {role === "assistant" && <img src={store.botInfo.icon_url}></img>}
      </div>
      {/* 消息内容 */}
      <div>
        <div
          className={`${style("content")} ${
            role === "assistant" ? style("content-assistant") : style("content-user")
          }`}
        >
          <Skeleton
            active
            loading={role === "assistant" && store.isLoading && !text}
          >
            {/* 如果有图片，展示图片 */}
            {images && (
              <div className={style("content-imgs")}>
                {images?.map((img) => (
                  <div className={style("content-imgs-img")}>
                    <img src={img.base64} style={{height:"100%",width:"100%",objectFit:'cover'}}></img>
                  </div>
                ))}
              </div>
            )}

            {/* 如果有文件/附件，展示附件 */}
            {files && (
              <div className={style("content-files")}>
                {files?.map((file) => (
                  <div className={style("content-files-file")}>
                    <div className={style("content-files-file-name")}>
                      {file.file_name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={style("content-text")}>
              {role === "assistant" ? <Markdown>{text}</Markdown> : <div className={style("content-text-user")}>{text}</div>}
            </div>
          </Skeleton>
        </div>
        {showSuggestions && (
          <div className={style("suggestions")}>
            <div className={style("suggestions-title")}>你可以继续问我：</div>
            {suggestions.map((suggestion) => (
              <div
                className={style("suggestions-suggestion")}
                onClick={async () => {
                  await sendMessage({ text: suggestion });
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
