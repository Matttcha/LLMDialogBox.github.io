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
  // {
  //   conversationId: "abc",
  //   text: "布偶猫怎么样",
  // },
  // {
  //   conversationId: "def",
  //   text: "布偶猫喜欢吃什么",
  // },
];

export const assistantReply1 = [
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

export const assistantReply2 = [
  {
    bot_id: "7460125530122190900",
    chat_id: "7468253872277159999",
    content:
      '在JavaScript中，可以通过定义节点类和树类来实现一棵二叉树。以下是一个简单的实现示例，包括插入节点和中序遍历的方法：\n\n```javascript\n// 定义二叉树节点类\nclass TreeNode {\n    constructor(value) {\n        this.value = value;\n        this.left = null;\n        this.right = null;\n    }\n}\n\n// 定义二叉树类\nclass BinaryTree {\n    constructor() {\n        this.root = null;\n    }\n\n    // 插入节点方法\n    insert(value) {\n        const newNode = new TreeNode(value);\n        if (!this.root) {\n            this.root = newNode;\n            return;\n        }\n        let current = this.root;\n        while (true) {\n            if (value < current.value) {\n                if (!current.left) {\n                    current.left = newNode;\n                    return;\n                }\n                current = current.left;\n            } else {\n                if (!current.right) {\n                    current.right = newNode;\n                    return;\n                }\n                current = current.right;\n            }\n        }\n    }\n\n    // 中序遍历方法\n    inorderTraversal(node = this.root) {\n        if (!node) return;\n        this.inorderTraversal(node.left);\n        console.log(node.value);\n        this.inorderTraversal(node.right);\n    }\n}\n\n\n// 测试代码\nconst tree = new BinaryTree();\ntree.insert(5);\ntree.insert(3);\ntree.insert(7);\ntree.insert(2);\ntree.insert(4);\ntree.insert(6);\ntree.insert(8);\n\nconsole.log("中序遍历结果:");\ntree.inorderTraversal();\n```\n\n### 代码说明：\n1. **TreeNode类**：表示二叉树的节点，每个节点包含一个值 `value`，以及指向左子节点和右子节点的引用 `left` 和 `right`。\n2. **BinaryTree类**：表示二叉树，包含一个根节点 `root`。\n    - **insert方法**：用于向二叉树中插入新节点。它从根节点开始，比较新节点的值与当前节点的值，决定向左还是向右子树移动，直到找到合适的位置插入新节点。\n    - **inorderTraversal方法**：用于中序遍历二叉树。中序遍历按照左子树、根节点、右子树的顺序访问节点。\n\n上述代码创建了一个二叉树，并插入了一些节点，最后进行中序遍历并输出节点的值。你可以根据需要扩展该类，添加更多的方法，如前序遍历、后序遍历、删除节点等功能。  ',
    content_type: "text",
    conversation_id: "7468253872277127231",
    created_at: 1738838358,
    id: "7468253877909848076",
    role: "assistant",
    type: "answer",
    updated_at: 1738838368,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7468253872277159999",
    content:
      '{"msg_type":"generate_answer_finish","data":"{\\"finish_reason\\":0,\\"FinData\\":\\"\\"}","from_module":null,"from_unit":null}',
    content_type: "text",
    conversation_id: "7468253872277127231",
    created_at: 1738838371,
    id: "7468253930770677796",
    role: "assistant",
    type: "verbose",
    updated_at: 1738838370,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7468253872277159999",
    content: "如何在JavaScript中计算二叉树的高度？",
    content_type: "text",
    conversation_id: "7468253872277127231",
    created_at: 1738838371,
    id: "7468253930770694180",
    role: "assistant",
    type: "follow_up",
    updated_at: 1738838370,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7468253872277159999",
    content: "用JavaScript实现二叉树的先序遍历和后序遍历。",
    content_type: "text",
    conversation_id: "7468253872277127231",
    created_at: 1738838371,
    id: "7468253930770710564",
    role: "assistant",
    type: "follow_up",
    updated_at: 1738838370,
  },
  {
    bot_id: "7460125530122190900",
    chat_id: "7468253872277159999",
    content: "提供一些实际的例子，展示如何在项目中使用JavaScript实现的二叉树。",
    content_type: "text",
    conversation_id: "7468253872277127231",
    created_at: 1738838371,
    id: "7468253930770726948",
    role: "assistant",
    type: "follow_up",
    updated_at: 1738838370,
  },
];
export const messages = [
  {
    role: "user",
    text: "布偶猫怎么样",
  },
  {
    role: "assistant",
    text: "布偶猫是一种非常受欢迎的宠物猫品种。\n\n**外观特征：**\n\n布偶猫体型较大且较为修长，身体柔软。它们有着丰厚的被毛，质地如丝绸般顺滑。毛色主要有重点色、双色、手套色等。布偶猫的眼睛通常为蓝色，大而明亮，犹如宝石般璀璨。它们的尾巴蓬松，像一把柔软的扫帚。\n\n**性格特点：**\n\n布偶猫性格温顺、友善，对人非常亲近。它们通常很安静，不喜欢大声叫唤，给人一种优雅的感觉。布偶猫很能忍耐疼痛，即使被小孩子不小心弄疼，也很少会发脾气。它们善于与其他宠物相处，是家庭宠物的理想选择。\n\n**饲养要点：**\n\n布偶猫的毛发需要定期梳理，以防止打结。由于其肠胃较为敏感，应选择高质量的猫粮，并注意饮食的规律。布偶猫喜欢与人互动，主人应给予足够的关注和陪伴。同时，为了保持布偶猫的健康，还需要定期带它们去看兽医进行体检和疫苗接种。\n\n总之，布偶猫以其美丽的外表和温柔的性格，成为了众多猫爱好者的心头好。",
    suggestions: [
      "如何训练布偶猫使用猫砂盆？",
      "哪些因素会影响布偶猫的价格？",
      "布偶猫适合和老人、小孩一起养吗？",
    ],
  },
];

export const file = {
  code: 0,
  data: {
    bytes: 51200,
    created_at: 1738756460,
    file_name: "中国海洋大学全日制本科生2025年一月批次毕业申请表.doc",
    id: "7467900276428177408",
  },
  msg: "",
};

export const assistantReply3 = [
  {
    bot_id: "7460125530122190900",
    chat_id: "7460952801024262182",
    content:
      "这是一张布偶猫的照片：[布偶猫](https://pic4.zhimg.com/v2-09d3d97f89a8edca86e9902276a3a409_r.jpg?source=1940ef5c) ，希望您喜欢。",
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
    content: "再生成一张布偶猫的照片",
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
    content: "布偶猫照片生成的风格有哪些？",
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
    content: "布偶猫照片拍摄时的光线和构图技巧有哪些？",
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
