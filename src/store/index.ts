import { create } from "zustand";
import { IBotInfo, IMessage } from "../type";
import { conversations } from "../mock";

// interface IConversations {
//   [key: string]: IMessageInter[];
// }

type TConversation = { conversationId: string; text: string };

interface IChatState {
  botInfo: IBotInfo;
  setBotInfo(botInfo: IBotInfo): void;
  currentConversation: string; // IMessageInter[];
  setCurrentConversation(currentConversation: string): void;
  // conversations: IConversations; // IConversation;
  // setConversations(conversations: IConversations): void;
  conversations: TConversation[];
  setConversations(conversations: TConversation[]): void;
  messages: IMessage[];
  setMessages(messages: IMessage[]): void;
}

/**
 * 对话框状态管理仓库
 * @botInfo: 智能体信息
 * @conversations: 历史会话列表
 */
export const useChatStore = create<IChatState>((set) => ({
  botInfo: {
    name: "你的智能助手",
    description:
      "作为你的智能伙伴，我能帮你分析文件、图片、写代码，又能陪你聊天、答疑解惑。",
  },
  setBotInfo: (botInfo: IBotInfo) => set({ botInfo }),
  currentConversation: "",
  setCurrentConversation: (currentConversation: string) =>
    set({ currentConversation }),

  // conversations,
  // setConversations: (conversations: IConversations) => set({ conversations }),
  conversations,
  setConversations: (conversations: TConversation[]) => set({ conversations }),
  messages: [],
  setMessages: (messages: IMessage[]) => set({ messages }),
}));
