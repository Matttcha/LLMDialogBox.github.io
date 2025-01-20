export const botInfo = {
  bot_id: "7460125530122190900",
  name: "邪恶布偶猫",
  description:
    "邪恶布偶猫是一款智能对话机器人，提供聊天互动、笑话分享、天气查询等多种功能。无论是闲聊解闷还是获取实用信息，邪恶布偶猫都能满足你的需求。快来和邪恶布偶猫交流，让它陪伴你的日常生活更加有趣！",
  icon_url:
    "https://p9-flow-imagex-sign.byteimg.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/default_bot_icon5.png~tplv-a9rns2rl98-image-qvalue.jpeg?rk3s=bbd3e7ed&x-expires=1739780592&x-signature=Ok5lFii5jE5fJRFSFiOD9EgOQVI%3D",
  create_time: 1736946490,
  update_time: 1737125264,
  version: "1737125263991",
  prompt_info: {
    prompt: "",
  },
  onboarding_info: {
    prologue: "嗨，你好！我对未来充满好奇，也有很多独特见解。",
    suggested_questions: [
      "你对未来哪些方面比较好奇呢？",
      "未来有什么值得期待的变化？",
      "怎样为未来做好准备？",
    ],
  },
  bot_mode: 0,
  model_info: {
    model_id: "1706077826",
    model_name: "豆包·工具调用",
    temperature: 1,
    top_p: 0.7,
    context_round: 3,
    max_tokens: 1024,
    response_format: "text",
  },
  plugin_info_list: [],
  knowledge: {
    knowledge_infos: [],
  },
  workflow_info_list: [],
  shortcut_commands: [],
};

export const conversations = [
  {
    conversationId: "abc",
    text: "布偶猫怎么样",
  },
  {
    conversationId: "def",
    text: "布偶猫喜欢吃什么",
  },
];

export const assistantReply = [
  {
    bot_id: "7460125530122190900",
    chat_id: "7460952801024262182",
    content:
      "我知道很多编程语言呢，比如 Python、Java、C++、C、JavaScript、C#、Go、Ruby、PHP、Swift、Kotlin、Rust、Scala 等等。每种编程语言都有其特点和适用场景。",
    content_type: "text",
    conversation_id: "7460952801024229414",
    created_at: 1737138449,
    id: "7460952801024278566",
    role: "assistant",
    type: "answer",
    updated_at: 1737138449,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7460952801024262182",
    content:
      '{"msg_type":"generate_answer_finish","data":"{\\"finish_reason\\":0,\\"FinData\\":\\"\\"}","from_module":null,"from_unit":null}',
    content_type: "text",
    conversation_id: "7460952801024229414",
    created_at: 1737138451,
    id: "7460952822880927795",
    role: "assistant",
    type: "verbose",
    updated_at: 1737138451,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7460952801024262182",
    content: "如何快速入门Python语言？",
    content_type: "text",
    conversation_id: "7460952801024229414",
    created_at: 1737138452,
    id: "7460952822880944179",
    role: "assistant",
    type: "follow_up",
    updated_at: 1737138451,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7460952801024262182",
    content: "学习编程语言对个人职业发展有哪些帮助？",
    content_type: "text",
    conversation_id: "7460952801024229414",
    created_at: 1737138452,
    id: "7460952822880976947",
    role: "assistant",
    type: "follow_up",
    updated_at: 1737138451,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7460952801024262182",
    content: "介绍一下Python语言的优势和适用场景",
    content_type: "text",
    conversation_id: "7460952801024229414",
    created_at: 1737138452,
    id: "7460952833735524362",
    role: "assistant",
    type: "follow_up",
    updated_at: 1737138451,
  },
];

// export const conversations = {
//   abc: [
//     {
//       role: "user",
//       text: "你好呀，介绍下你自己吧",
//     },
//     {
//       role: "assistant",
//       text: "你好，我是你的智能助手邪恶布偶猫，是一款智能对话机器人，提供聊天互动、笑话分享、天气查询等多种功能。无论是闲聊解闷还是获取实用信息，邪恶布偶猫都能满足你的需求。快来和邪恶布偶猫交流，让它陪伴你的日常生活更加有趣！",
//     },
//     {
//       role: "user",
//       text: "你好呀，介绍下你自己吧",
//     },
//     {
//       role: "assistant",
//       text: "你好，我是你的智能助手邪恶布偶猫",
//     },
//     {
//       role: "user",
//       text: "你好呀，介绍下你自己吧",
//     },
//     {
//       role: "assistant",
//       text: "你好，我是你的智能助手邪恶布偶猫",
//     },
//   ],
//   def: [
//     {
//       role: "user",
//       text: "布偶猫是什么样的",
//     },
//     {
//       role: "assistant",
//       text: "好吃懒做",
//       suggestions: [
//         "Python语言适用于哪些领域？",
//         "分享一些用Python语言实现的案例",
//       ],
//     },
//   ],
// };
