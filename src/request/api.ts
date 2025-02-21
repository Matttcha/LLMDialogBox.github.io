import { getUserConfig } from "../store/index";
import { message } from "antd";
import { botInfo } from "../mock";

export const baseUrl = "https://api.coze.cn/"; // 国内地址

/**
 * 获取智能体信息
 * @returns
 */
export const getBotInfo = async () => {
  const { token, botId } = getUserConfig();
  if (!token || !botId) {
    return botInfo;
  }
  const res = await fetch(
    `${baseUrl}v1/bot/get_online_info?bot_id=${getUserConfig().botId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getUserConfig().token}`,
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const resJson = await res.json();
    const { code, data, msg } = resJson;
    if (code !== 0 || !data) {
      return botInfo;
    }
    return data;
  } catch {}
};

/**
 * 创建会话：发起新会话 或 在已有会话中发送消息，conversation_id为空时发起新会话，不为空则表示在指定会话中继续提问
 * @returns
 */
export const getChat = async (
  content,
  content_type,
  conversation_id?: string
) => {
  const { token, botId, userName, stream = true } = getUserConfig();
  if (!token || !botId) {
    message.error("请先设置您的的 COZE TOKEN 和 BOT ID");
    return;
  }
  return await fetch(`${baseUrl}v3/chat?conversation_id=${conversation_id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bot_id: botId,
      user_id: userName,
      stream,
      auto_save_history: true,
      additional_messages: [
        {
          role: "user",
          content,
          content_type,
        },
      ],
    }),
  });
};

/**
 * 轮询查询指定会话（conversation）中指定对话（chat）中非流式响应消息的响应结果，从而确认本轮对话已结束（答复内容已生成完毕），再调用下一个接口查看消息详情
 * @returns
 */
export const asyncChatRetrieve = async (
  chat_id: string,
  conversation_id: string
) => {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(
          `${baseUrl}v3/chat/retrieve?chat_id=${chat_id}&conversation_id=${conversation_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getUserConfig().token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const resJson = await res.json();
        const {
          code,
          data: { status },
          msg,
        } = resJson;
        if (status === "completed") {
          clearInterval(timer);
          const messageData = await getChatMessage(chat_id, conversation_id);
          resolve(messageData);
        } else if (status !== "created" && status !== "in_progress") {
          clearInterval(timer);
          reject(resJson.msg || "Request Failed");
        }
      } catch {
        clearInterval(timer);
      }
    }, 5000); // 之后可以改成1000
  });
};

/**
 * 查询指定会话（conversation）中指定对话（chat）中非流式响应消息
 * @returns
 */
export const getChatMessage = async (
  chat_id: string,
  conversation_id: string
) => {
  const res = await fetch(
    `${baseUrl}v3/chat/message/list?chat_id=${chat_id}&conversation_id=${conversation_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getUserConfig().token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const resJson = await res.json();
  const { code, data, msg } = resJson;
  return data;
};

/**
 * 获取历史消息列表:获取指定会话（conversation）下的所有消息（message list）
 * @returns 例子 conversation_id=7461853563896234018
 */
export const getMessageList = async (conversation_id?: string) => {
  const res = await fetch(
    `${baseUrl}v1/conversation/message/list?conversation_id=${conversation_id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getUserConfig().token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: "asc",
      }),
    }
  );
  const resJson = await res.json();
  const { code, data, msg } = resJson;
  return data;
};

export const uploadFile = async (form_data) => {
  const res = await fetch("https://api.coze.cn/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getUserConfig().token,
    },
    body: form_data,
  });
  const jsonData = await res.json();
  return jsonData; // Promise
};
