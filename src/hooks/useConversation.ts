import React, { useEffect, useState } from "react";
import { useChatStore } from "../store";
import { asyncChatRetrieve, getChat } from "../request/api";
import { IContent, IInput, IMessage } from "../type";
import { assistantReply2 } from "../mock";
import { isEmpty } from "lodash-es";
import { createParser } from "eventsource-parser";

const statusTextMap = new Map([
  [400, "Bad Request"],
  [401, "Unauthorized"],
  [403, "Forbidden"],
  [429, "Too Many Requests"],
]);

function useConversation() {
  const store = useChatStore();

  const sendMessage = async (input: IInput) => {
    // 在接口数据返回前插入两条正在处理中的问答
    const newMessages = [
      ...store.messages,
      {
        role: "user",
        text: input.text,
        files: input.fileList,
        images: input.imageList,
      },
      {
        role: "assistant",
        text: "",
      },
    ] as IMessage[];
    store.setMessages(newMessages);
    // 发送消息不需要重新请求历史消息列表，否则历史消息列表会覆盖messages
    store.switchConversation && store.setSwitchConversation(false);
    store.setIsLoading(true);
    await handleSend(input, newMessages);

    //// mock
    // const conversationId = store.currentConversation;
    // if (!conversationId) {
    //   //没有conversationId
    //   store.setConversations([
    //     { conversationId: "7460952801024262182", text: input.text },
    //     ...store.conversations,
    //   ]);
    //   store.setCurrentConversation("7460952801024262182");
    // }
    // const data = await assistantReply2; // mock
    // const answer = data.find((item) => item.type === "answer")?.content;
    // const follow_up = data
    //   .filter((item) => item.type === "follow_up")
    //   .map((item) => item.content);
    // store.setMessages([
    //   ...newMessages.slice(0, -1),
    //   {
    //     role: "assistant",
    //     text: answer || "",
    //     suggestions: follow_up,
    //   },
    // ]);

    // store.setIsLoading(false);

    //////mock
  };

  /**
   * handleSend 发送消息
   * @param input
   */
  const handleSend = async (input: IInput, newMessages) => {
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
        let result = { ...newMessages.slice(-1)[0], suggestions: [] };
        await handleSSEResponse(
          res,
          newMessages,
          result,
          conversationId,
          input.text
        );
      } else {
        // 非流式
        const resJson = await res.json();
        const {
          code,
          data: { id: chat_id, conversation_id },
          msg,
        } = resJson;

        if (!conversationId) {
          //没有conversationId
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
          ...newMessages.slice(0, -1),
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
          file_id: file.id,
        });
      });
    }
    if (input.imageList?.length) {
      content_type = "object_string";
      input.imageList.forEach((image) => {
        contentArr.push({
          type: "image",
          file_id: image.id,
        });
      });
    }
    return { contentArr, content_type };
  };

  const handleSSEResponse = async (
    res,
    _messages,
    result,
    conversationId,
    text
  ) => {
    await parseSSEResponse(res, (message) => {
      if (message.includes("[DONE]")) {
        console.log("result", result);
        store.setMessages([
          ..._messages.slice(0, -1),
          {
            role: "assistant",
            text: result.text,
            suggestions: result.suggestions,
          },
        ]);
        return;
      }
      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        throw new Error("Parsing failed");
      }

      if (!conversationId) {
        // const { chat_id } = data;
        // if (chat_id && chat_id !== store.currentConversation) {
        //   store.setConversations([
        //     { conversationId: chat_id, text },
        //     ...store.conversations,
        //   ]);
        //   store.setCurrentConversation(chat_id); // 设置新获取到的chat_id
        // }

        // conversation_id
        const { conversation_id } = data;
        if (conversation_id && conversation_id !== store.currentConversation) {
          store.setConversations([
            { conversationId: conversation_id, text },
            ...store.conversations,
          ]);
          store.setCurrentConversation(conversation_id); // 设置新获取到的chat_id
        }
      }

      if (["answer"].includes(data?.type) && !data.created_at) {
        result.text += data?.content;
        store.setMessages([
          ..._messages.slice(0, -1),
          { role: "assistant", text: result.text },
        ]); ///
      } else if (data?.type === "follow_up") {
        console.log(data.content);
        result.suggestions?.push(data.content);
      } else if (data?.status == "failed") {
        throw new Error(data.last_error!.msg);
      }
    });
  };

  const parseSSEResponse = async (resp, onMessage) => {
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      if (!isEmpty(error)) {
        throw new Error(JSON.stringify(error));
      }
      const statusText =
        resp.statusText || statusTextMap.get(resp.status) || "";
      console.log(`${resp.status} ${statusText}`);
    }

    // 创建一个SSE事件解析器。参数：通常包括一个回调函数，用于处理解析到的事件
    const parser = createParser({
      // 使用自定义解析器（通过 createParser 创建）解析SSE事件和数据
      onEvent: (event) => {
        if (event.data) {
          // console.log("Event data:", event.data);
          onMessage(event.data);
        }
      },
    });
    const decoder = new TextDecoder(); // TextDecoder 将二进制数据块解码为字符串，用于解码从响应体中读取的数据块
    for await (const chunk of streamAsyncIterable(resp.body!)) {
      const str = decoder.decode(chunk, { stream: true }); // 解码一个数据块，{ stream: true } 选项表示数据块是流的一部分，可能不完整。参数：chunk 是要解码的二进制数据块
      parser.feed(str); // 向解析器“喂食”字符串数据，解析器尝试从中解析出SSE事件。参数：str 是要解析的字符串数据。
    }
  };

  async function* streamAsyncIterable<T = unknown>(stream: ReadableStream<T>) {
    // ReadableStream 获取一个读取器，用于异步读取流中的数据。
    const reader = stream.getReader();
    try {
      while (true) {
        // 异步读取流中的下一个数据块。返回一个包含 done 和 value 的对象，done 表示流是否已结束，value 是读取到的数据块。
        const { done, value } = await reader.read();

        if (done) {
          return;
        }
        yield value;
      }
    } finally {
      reader.releaseLock(); // 释放读取器对流的锁定，允许其他读取器读取流。确保在函数退出时释放资源。
    }
  }

  return {
    sendMessage,
  };
}

export default useConversation;
