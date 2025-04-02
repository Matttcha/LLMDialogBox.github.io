const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js"); // 引用公共的配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 用于将组件的css打包成单独的文件输出到`lib`目录中

const prodConfig = {
  mode: "production", // 生产模式
  entry: path.join(__dirname, "../src/index.tsx"), // 为什么和开发模式不一样？
  output: {
    path: path.join(__dirname, "../lib/"),
    filename: "index.js",
    libraryTarget: "umd", // 采用通用模块定义，让别人在使用我们的组件时可以以多种方式引入，<script src=".....">  npm install 包名
    libraryExport: "default", // 兼容 ES6 Module、CommonJS 和 AMD 模块规范
  },
  // entry: path.join(__dirname, "../docs/index.tsx"), // 入口，处理资源文件的依赖关系
  // output: {
  //   path: path.join(__dirname, "../docs/"),
  //   filename: "dev.js",
  // },
  module: {
    // loader ：转换器
    rules: [
      {
        test: /.s[ac]ss$/,
        exclude: /.min.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "global",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // 其他选项
                    },
                  ],
                ],
              },
            },
          },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.less$/, // 匹配所有以.less结尾的文件
        use: [
          "style-loader", // 将CSS注入到DOM中
          "css-loader", // 解析CSS文件（使其能够被Webpack处理）
          "less-loader", // 将Less编译为CSS
        ],
      },
    ],
  },
  plugins: [
    // 插件 plugin ：让webpack具备更多的功能
    new MiniCssExtractPlugin({
      filename: "index.min.css", // 提取后的css的文件名
    }),
  ],
  externals: {
    // 。。。。。。。
    // 定义外部依赖，避免把react和react-dom打包进去
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
  },
};
module.exports = merge(prodConfig, baseConfig); // 合并配置
