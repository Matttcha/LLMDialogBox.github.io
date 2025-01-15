# LLMDialogBox

项目结构

├── config  # webpack配置
     ├── webpack.base.js # 公共配置，因为开发和发布打包时webpack配置有一部分是公共并且重复的，因此把这部分的配置单独拿出来放到该文件中
     ├── webpack.dev.config.js # 开发环境配置
     └── webpack.prod.config.js # 打包发布环境配置
├── demo # 开发时预览代码
       ├── src # 示例代码目录
            ├── index.tsx # 入口 tsx 文件
            ├── index.html # 入口 html 文件
            └── index.scss # 样式文件
├── lib # 组件打包结果目录
├── node_modules # 安装依赖时自动生成
├── src # 组件源代码目录
     └── index.tsx  # 组件源代码
├── .babelrc # babel 配置
├── .gitignore # git 忽略
├── .npmignore # 指定发布 npm 的时候需要忽略的文件和文件夹
├── README.md
├── package-lock.json
└── package.json
