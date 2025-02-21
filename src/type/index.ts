export interface IUserConfig {
  token: string;
  botId: string;
  userName: string;
  stream: boolean;
}

export interface IBotInfo {
  name: string;
  description: string;
  icon_url?: string;
}

export interface IImage {
  file_name: string;
  id: string;
  base64: string;
  status?: string;
}
 
export interface IFile {
  file_name: string;
  id: string;
  status?: string;
}

export interface IInput {
  text: string;
  fileList?: IFile[];
  imageList?: IImage[];
}

export type object_string_type = "text" | "file" | "image";

export interface IContent {
  type: object_string_type;
  text?: string;
  file_id?: string;
  file_url?: string;
}

/**
 * 消息内容的类型，取值包括：
 * @text：文本。
 * @object_string：多模态内容，即文本和文件的组合、文本和图片的组合。
 */
export type content_type = "object_string" | "text";

/**
 * 消息类型。
 * @question：用户输入内容。
 * @answer：智能体返回给用户的消息内容，支持增量返回。如果工作流绑定了 messge 节点，可能会存在多 answer 场景，此时可以用流式返回的结束标志来判断所有 answer 完成。
 * @function_call：智能体对话过程中调用函数（function call）的中间结果。
 * @tool_output：调用工具 （function call）后返回的结果。
 * @tool_response：调用工具 （function call）后返回的结果。
 * @follow_up：如果在智能体上配置打开了用户问题建议开关，则会返回推荐问题相关的回复内容。
 */
export type message_type =
  | "answer"
  | "function_call"
  | "tool_response"
  | "verbose"
  | "follow_up";

/**
 * 发送这条消息的实体。取值：
 * @user：代表该条消息内容是用户发送的。
 * @assistant：代表该条消息内容是智能体发送的。
 */
type role = "user" | "assistant";

export type ResponseMessageType = {
  created_at?: string;
  type: message_type;
  content: string;
  status?: "failed" | "in_progress" | "created";
  last_error?: {
    msg: string;
  };
};
export type ChatContentType = {
  type: "inline" | "page";
};

export interface FileInfoInter {
  file: File;
  file_id?: string;
  file_url?: string;
  name: string;
  base64?: string;
  status?: "uploading" | "uploaded" | "failed";
}

/**
 * 对话类型
 *
 */
export interface ISwitchConversationMessage {
  conversationId: string;
  message: IMessage[];
}
export interface IMessage {
  role: role;
  text: string;
  suggestions?: string[];
  files?: IFile[];
  images?: IImage[];
  error?: string;
}
export interface MessageApiInter {
  role: role;
  content: string;
  content_type: content_type;
}
export interface SettingInter {
  bot_id?: string;
  bot_id2?: string;
  client_id?: string;
  token?: string;
  refresh_token?: string;
  access_token?: string;
  stream?: boolean;
  code_verifier?: string;
  auth_type?: "one" | "two";
  custom_url?: string;
}
export interface ResponseMessageInter {
  type: message_type;
  content: string;
}
export interface ResponseRetrieveInter {
  code: number;
  data: ResponseMessageInter[];
  msg: string;
}
