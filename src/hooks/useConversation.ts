import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store";
import { asyncChatRetrieve, getChat } from "../request/api";
import { IContent, IInput, IMessage } from "../type";
import { assistantReply2 } from "../mock";
import { isEmpty } from "lodash-es";
import { createParser } from "eventsource-parser";
import { message } from "antd";
import DialogPerfMonitor from "../monitor";
import { generateConversationId } from "../utils";

const statusTextMap = new Map([
  [400, "Bad Request"],
  [401, "Unauthorized"],
  [403, "Forbidden"],
  [429, "Too Many Requests"],
]);

/**
 * useConversation：处理【收/发消息】逻辑，接收流式/非流式 响应
 */
function useConversation() {
  const monitor = useRef(new DialogPerfMonitor());
  const store = useChatStore();

  const sendMessage = async (input: IInput) => {
    if (store.isLoading) {
      message.error("还有进行中的对话，请稍后再试");
      return;
    }
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
    // store.switchConversation && store.setSwitchConversation(false);
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
   * @param newMessages
   */
  const handleSend = async (input: IInput, newMessages) => {
    // 获取当前会话id
    const conversationId = store.currentConversation;
    // 发送【发起对话】接口，获取conversation_id和chat_id
    // 如果是新对话,把会话id和第一个问题文本一起存入store.conversations，同时更新store.currentConversation
    // 分情况写逻辑，如果是流式响应，直接处理结果；如果是非流式，用获取到的会话id和对话id作为查询参数，轮询“查看对话详情”接口，得到完成的结果后再调用“查看对话消息详情”接口，获取消息详情

    const conversationPerId = generateConversationId();
    monitor.current.startConversation(conversationPerId); // 监控标记：对话开始
    try {
      const { contentArr, content_type } = buildContentArr(input); // 将输入信息转换成接口所需的格式
      const res = await getChat(
        JSON.stringify(contentArr),
        content_type,
        conversationId
      );

      const contentType = res.headers.get("Content-Type");
      if (contentType?.includes("text/event-stream")) {
        // 流式
        let result = { ...newMessages.slice(-1)[0], suggestions: [] };
        monitor.current.recordStreamingStart(conversationPerId); // 监控标记：流式响应开始
        await handleSSEResponse(
          res,
          newMessages,
          result,
          conversationId,
          input.text,
          conversationPerId
        );
      } else {
        // 非流式（注意：如果流式响应接口报错，此时也会走这个逻辑！）
        const resJson = await res.json();
        // // 错误处理
        const { code, msg } = resJson;
        if (code !== 0) {
          message.error(msg);
          if (!conversationId) {
            // 如果是开启一个新对话，此时清除刚才在messages中新增的消息
            store.setMessages([]);
          } else {
            // 如果是接着之前的对话继续发消息，则把智能体的回答改成报错信息
            newMessages[newMessages.length - 1].text = msg;
            store.setMessages(newMessages);
            // 更新缓存
            const foundObject = store.switchConversationMessage.find(
              (obj) => obj.conversationId === store.currentConversation
            );
            const newArr = store.switchConversationMessage.filter(
              (item) => item.conversationId !== foundObject?.conversationId
            );

            const updatedMessages = [
              ...newArr, // 使用已经过滤后的新数组
              {
                conversationId: store.currentConversation,
                message: newMessages,
              },
            ];

            store.setSwitchConversationMessage(updatedMessages);
          }

          store.setIsLoading(false);
          return;
        }
        const {
          data: { id: chat_id, conversation_id },
        } = resJson;

        if (!conversationId) {
          // 如果为空，表示此时是开启一个新对话
          // 1.用从接口获取到的 conversation_id 和 用户的第一条消息文本更新conversations，从而更新左侧历史会话列表
          // 2.将此时从接口获取到的 conversation_id 赋给 currentConversation
          store.setConversations([
            { conversationId: conversation_id, text: input.text },
            ...store.conversations,
          ]);
          store.setCurrentConversation(conversation_id); // 设置新获取到的conversation_id
        }

        // 用 chat_id 和 conversation_id 进行轮询，轮询结束后获得对话消息详情
        const data = await asyncChatRetrieve(chat_id, conversation_id);
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

        // 更新缓存
        const foundObject = store.switchConversationMessage.find(
          (obj) => obj.conversationId === conversation_id
        );
        if (!foundObject) {
          store.setSwitchConversationMessage([
            ...store.switchConversationMessage,
            {
              conversationId: conversation_id,
              message: [
                ...newMessages.slice(0, -1),
                {
                  role: "assistant",
                  text: answer,
                  suggestions: follow_up,
                },
              ],
            },
          ]);
        } else {
          const newArr = store.switchConversationMessage.filter(
            (item) => item.conversationId !== foundObject.conversationId
          );

          const updatedMessages = [
            ...newArr, // 使用已经过滤后的新数组
            {
              conversationId: conversation_id,
              message: [
                ...newMessages.slice(0, -1),
                {
                  role: "assistant",
                  text: answer,
                  suggestions: follow_up,
                },
              ],
            },
          ];

          store.setSwitchConversationMessage(updatedMessages);
        }
      }
    } catch (e) {
    } finally {
      monitor.current.endConversation(conversationPerId); // 监控标记：对话结束
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
    text,
    conversationPerId
  ) => {
    await parseSSEResponse(res, (message) => {
      if (message.includes("[DONE]")) {
        store.setMessages([
          ..._messages.slice(0, -1),
          {
            role: "assistant",
            text: result.text,
            suggestions: result.suggestions,
          },
        ]);
        const foundObject = store.switchConversationMessage.find(
          (obj) => obj.conversationId === result.conversation_id
        );
        if (!foundObject) {
          store.setSwitchConversationMessage([
            ...store.switchConversationMessage,
            {
              conversationId: result.conversation_id,
              message: [
                ..._messages.slice(0, -1),
                {
                  role: "assistant",
                  text: result.text,
                  suggestions: result.suggestions,
                },
              ],
            },
          ]);
        } else {
          const newArr = store.switchConversationMessage.filter(
            (item) => item.conversationId !== foundObject.conversationId
          );

          const updatedMessages = [
            ...newArr, // 使用已经过滤后的新数组
            {
              conversationId: result.conversation_id,
              message: [
                ..._messages.slice(0, -1),
                {
                  role: "assistant",
                  text: result.text,
                  suggestions: result.suggestions,
                },
              ],
            },
          ];

          store.setSwitchConversationMessage(updatedMessages);
          // let newArr = store.switchConversationMessage.filter(function (item) {
          //   return item !== foundObject;
          // });
          // // store.setSwitchConversationMessage(newArr) //
          // store.setSwitchConversationMessage([
          //   ...store.switchConversationMessage,
          //   {
          //     conversationId: result.conversation_id,
          //     message: [
          //       ..._messages,
          //       {
          //         role: "assistant",
          //         text: result.text,
          //         suggestions: result.suggestions, //
          //       },
          //     ],
          //   },
          // ]);
        }

        return;
      }
      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        throw new Error("Parsing failed");
      }

      monitor.current.recordChunkArrival(
        conversationPerId,
        data.type === "answer" ? "text" : "suggestion"
      );

      if (!conversationId) {
        const { conversation_id } = data;
        if (conversation_id && conversation_id !== store.currentConversation) {
          store.setConversations([
            { conversationId: conversation_id, text },
            ...store.conversations,
          ]);
          store.setCurrentConversation(conversation_id); // 设置新获取到的chat_id
          result.conversation_id = conversation_id;
        }
      } else {
        const { conversation_id } = data;
        result.conversation_id = conversation_id;
      }

      if (["answer"].includes(data?.type) && !data.created_at) {
        result.text += data?.content;
        store.setMessages([
          ..._messages.slice(0, -1),
          { role: "assistant", text: result.text },
        ]);
      } else if (data?.type === "follow_up") {
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
    }

    // 创建一个SSE事件解析器。参数：通常包括一个回调函数，用于处理解析到的事件
    const parser = createParser({
      // 使用自定义解析器（通过 createParser 创建）解析SSE事件和数据
      onEvent: (event) => {
        if (event.data) {
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
