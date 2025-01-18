import { create } from "zustand";
import { IBotInfo, IMessageInter } from "../type";

/**
 * 会话列表类型
 * @description: 对象类型，属性值为会话id（即conversation_id），属性值是本次会话对应的对话记录数组
 */
// interface IConversation {
//   [key: string]: IMessageInter[];
// }

interface IChatState {
  botInfo: IBotInfo;
  setBotInfo(botInfo: IBotInfo): void;
  // isNewConversation: boolean;
  // setIsNewConversation(isNewConversation: boolean): void;
  conversations: IMessageInter[][]; // IConversation;
  setConversations(conversations: IMessageInter[][]): void;
}

/**
 * 对话框状态管理仓库
 * @botInfo: 智能体信息
 * @isNewConversation: 是否是新对话，true表示新对话，false表示历史对话
 * @conversations: 会话列表
 */
export const useChatStore = create<IChatState>((set) => ({
  botInfo: {
    name: "你的智能助手",
    description:
      "作为你的智能伙伴，我能帮你分析文件、图片、写代码，又能陪你聊天、答疑解惑。",
  },
  setBotInfo: (botInfo: IBotInfo) => set({ botInfo }),
  // isNewConversation: true,
  // setIsNewConversation: (isNewConversation: boolean) =>
  //   set({ isNewConversation }),
  conversations: [
    [
      {
        role: "user",
        text: "你好呀，介绍下你自己吧",
      },
      {
        role: "assistant",
        text: "你好，我是你的智能助手邪恶布偶猫，是一款智能对话机器人，提供聊天互动、笑话分享、天气查询等多种功能。无论是闲聊解闷还是获取实用信息，邪恶布偶猫都能满足你的需求。快来和邪恶布偶猫交流，让它陪伴你的日常生活更加有趣！",
      },
      {
        role: "user",
        text: "你好呀，介绍下你自己吧",
      },
      {
        role: "assistant",
        text: "你好，我是你的智能助手邪恶布偶猫",
      },
      {
        role: "user",
        text: "你好呀，介绍下你自己吧",
      },
      {
        role: "assistant",
        text: "你好，我是你的智能助手邪恶布偶猫",
      },
      {
        role: "user",
        text: "你好呀，介绍下你自己吧",
      },
      {
        role: "assistant",
        text: "你好，我是你的智能助手邪恶布偶猫",
      },
    ],
  ],
  setConversations: (conversations: IMessageInter[][]) =>
    set({ conversations }),
}));
