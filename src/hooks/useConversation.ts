import React, { useEffect, useState } from "react";
import { useChatStore } from "../store";
import { asyncChatRetrieve, getChat } from "../request/api";
import { IContent, IInput, IMessage } from "../type";
import { assistantReply } from "../mock";

function useConversation() {
  const store = useChatStore();

  const sendMessage = async (input: IInput) => {
    // 在接口数据返回前插入两条正在处理中的问答
    store.setMessages([
      ...store.messages,
      {
        role: "user",
        text: input.text,
      },
      {
        role: "assistant",
        text: "",
      },
    ]);
    // 发送消息不需要重新请求历史消息列表，否则历史消息列表会覆盖messages
    store.switchConversation && store.setSwitchConversation(false);
    store.setIsLoading(true);
    // await handleSend(input);
  };

  /**
   * handleSend 发送消息
   * @param input
   */
  const handleSend = async (input: IInput) => {
    // 获取当前会话id
    const conversationId = store.currentConversation;
    // 发送【发起对话】接口，获取conversation_id和chat_id
    // 如果是新对话,把会话id和第一个问题文本一起存入store.conversations，同时更新store.currentConversation
    // 分情况写逻辑，如果是流式响应，直接处理结果；如果是非流式，用获取到的会话id和对话id作为查询参数，轮询“查看对话详情”接口，得到完成的结果后再调用“查看对话消息详情”接口，获取消息详情
    try {
      const { contentArr, content_type } = buildContentArr(input);
      const res = await getChat(
        JSON.stringify(contentArr),
        content_type,
        conversationId
      );

      const contentType = res.headers.get("Content-Type");
      if (contentType?.includes("text/event-stream")) {
        // 流式
        await handleSSEResponse(res);
      } else {
        // 非流式
        const resJson = await res.json();
        const {
          code,
          data: { id: chat_id, conversation_id },
          msg,
        } = resJson;

        if (!conversationId) {
          store.setConversations([
            { conversationId: conversation_id, text: input.text },
            ...store.conversations,
          ]);
          store.setCurrentConversation(conversation_id); // 设置新获取到的conversation_id
        }

        // 用 chat_id 和 conversation_id 进行轮询，轮询结束后获得对话消息详情
        const data = await asyncChatRetrieve(chat_id, conversation_id); // 暂时注视
        // const data = await assistantReply; // mock
        const answer = data.find((item) => item.type === "answer")?.content;
        const follow_up = data
          .filter((item) => item.type === "follow_up")
          .map((item) => item.content);
        store.setMessages([
          ...store.messages.slice(0, -1),
          {
            role: "assistant",
            text: answer || "",
            suggestions: follow_up,
          },
        ]);
      }
    } catch {
    } finally {
      store.setIsLoading(false);
    }
  };

  /**
   * buildContentArr 把多模态输入内容转化成接口所需的object_string object类型(数组序列化之后的 JSON String)
   * @param input
   * @returns
   */
  const buildContentArr = (input: IInput) => {
    let content_type = "text";
    let contentArr: IContent[] = [];
    if (input.text) {
      contentArr.push({
        type: "text",
        text: input.text,
      });
    }
    if (input.fileList?.length) {
      content_type = "object_string";
      input.fileList.forEach((file) => {
        contentArr.push({
          type: "file",
          file_id: file.file_id,
        });
      });
    }
    if (input.imageList?.length) {
      content_type = "object_string";
      input.imageList.forEach((image) => {
        contentArr.push({
          type: "image",
          file_url: image.file_url,
        });
      });
    }
    return { contentArr, content_type };
  };

  const handleSSEResponse = async (res) => {
    await parseSSEResponse(res, (message) => {});
  };

  const parseSSEResponse = async (res, onMessage) => {};

  return {
    sendMessage,
  };
}

export default useConversation;
