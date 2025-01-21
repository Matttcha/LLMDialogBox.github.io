import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import getStyleName from "../../utils/getStyleName";
import { useChatStore } from "../../store";
import { IMessage } from "../../type";
import { Skeleton } from "antd";
import useConversation from "../../hooks/useConversation";
const style = getStyleName("message");

interface IProps {
  message: IMessage;
  showSuggestions?: boolean;
}

// const suggestions = [
//   "Python语言适用于哪些领域？",
//   "分享一些用Python语言实现的案例",
// ];

/**
 * 对话消息组件：分为【用户提问】和【智能助手答复】
 * @param props
 */
const Message = (props: IProps) => {
  const { message, showSuggestions = false } = props;
  const { role, text, suggestions = [], files, images } = message;
  const store = useChatStore();
  const { sendMessage } = useConversation();
  useEffect(() => {}, [store]);
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
            role === "assistant" ? style("content-assistant") : ""
          }`}
        >
          <Skeleton
            active
            loading={role === "assistant" && store.isLoading && !text}
          >
            {/* 如果有图片，展示图片 */}
            {images && images.length && (
              <div className={style("content-imgs")}>
                {images?.map((img) => (
                  <div className={style("content-imgs-img")}>图片</div>
                ))}
              </div>
            )}
            {/* 如果有文件/附件，展示附件 */}
            {files && files.length && (
              <div className={style("content-files")}>
                {files?.map((file) => (
                  <div className={style("content-files-file")}>文件</div>
                ))}
              </div>
            )}
            <div className={style("content-text")}>{text}</div>
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
