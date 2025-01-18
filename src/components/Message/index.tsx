import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import getStyleName from "../../common/utils/getStyleName";

const style = getStyleName("message");

interface IProps {
  type: string; // user用户；assitent智能助手
  imgs?: [];
  files?: [];
}

const suggestions = [
  "Python语言适用于哪些领域？",
  "分享一些用Python语言实现的案例",
];

/**
 * 对话消息组件：分为【用户提问】和【智能助手答复】
 * @param props
 */
const Message = (props: IProps) => {
  const { type, imgs, files } = props;
  return (
    <div className={style("")}>
      {/* 头像 */}
      <div
        className={`${style("avatar")} ${
          type === "assistant" ? style("avatar-assistant") : ""
        }`}
      ></div>
      {/* 消息内容 */}
      <div>
        <div
          className={`${style("content")} ${
            type === "assistant" ? style("content-assistant") : ""
          }`}
        >
          {/* 如果有图片，展示图片 */}
          {imgs && imgs.length && (
            <div className={style("content-imgs")}>
              {imgs?.map((img) => (
                <div className={style("content-imgs-img")}>图片</div>
              ))}
            </div>
          )}
          {/* 如果有文件/附件，展示附近 */}
          {files && files.length && (
            <div className={style("content-files")}>
              {files?.map((file) => (
                <div className={style("content-files-file")}>文件</div>
              ))}
            </div>
          )}
          <div className={style("content-text")}>你好你好你好</div>
        </div>
        {type === "assistant" && (
          <div className={style("suggestions")}>
            <div className={style("suggestions-title")}>你可以继续问我：</div>
            {suggestions.map((suggestion) => (
              <div
                className={style("suggestions-suggestion")}
                onClick={() => {}}
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
