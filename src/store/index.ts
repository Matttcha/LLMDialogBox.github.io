import { create } from "zustand";
import { IBotInfo, IMessage, IUserConfig ,ISwitchConversationMessage} from "../type";
import { conversations, messages as messagesMock } from "../mock";

type TConversation = { conversationId: string; text: string };

interface IChatState {
  switchConversationMessage: ISwitchConversationMessage[];
  setSwitchConversationMessage(switchConversationMessage: ISwitchConversationMessage[]): void;

  userConfig: IUserConfig;
  setUserConfig(userConfig: IUserConfig): void;
  botInfo: IBotInfo;
  setBotInfo(botInfo: IBotInfo): void;
  currentConversation: string;
  setCurrentConversation(currentConversation: string): void;
  conversations: TConversation[];
  setConversations(conversations: TConversation[]): void;
  switchConversation: boolean;
  setSwitchConversation(switchConversation: boolean): void;
  messages: IMessage[];
  setMessages(messages: IMessage[]): void;
  isLoading: boolean;
  setIsLoading(isLoading: boolean): void;
}

/**
 * 对话框状态管理仓库
 * @botInfo: 智能体信息
 * @currentConversation: 当前会话的id
 * @conversations: 历史会话列表
 * @switchConversation: 是否是切换历史会话
 * @messages: 消息列表
 * @isLoading: 消息是否发送中
 */
export const useChatStore = create<IChatState>((set) => ({
  switchConversationMessage: [],
  setSwitchConversationMessage:(switchConversationMessage:ISwitchConversationMessage[])=>set({switchConversationMessage}),


  userConfig: {
    // token:"",
      token:"pat_oyuR51Ie39pEnzHEbovqoM1hDFp7y8Nu1U9In5AHL1rUQHn3O7KO724CzFGGf4TM",
    botId: "7460125530122190900",
    // botId: "",
    userName: "evilragdollcat",
    // userName: "",
    stream: true,
  },
  setUserConfig: (userConfig: IUserConfig) => set({ userConfig }),

  botInfo: {
    name: "你的智能助手",
    description:
      "作为你的智能伙伴，我能帮你分析文件、图片、写代码，又能陪你聊天、答疑解惑。",
  },
  setBotInfo: (botInfo: IBotInfo) => set({ botInfo }),
  currentConversation: "",
  setCurrentConversation: (currentConversation: string) =>
    set({ currentConversation }),
  conversations,
  setConversations: (conversations: TConversation[]) => set({ conversations }),
  switchConversation: false,
  setSwitchConversation: (switchConversation: boolean) =>
    set({ switchConversation }),
  messages: [], // messagesMock as IMessage[],
  setMessages: (messages: IMessage[]) => set({ messages }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

export const getUserConfig = () => useChatStore.getState().userConfig;