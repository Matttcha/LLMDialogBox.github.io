const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js"); // 公共配置

const devConfig = {
  mode: "development", // 开发模式
  entry: path.join(__dirname, "../docs/index.tsx"), // 入口，处理资源文件的依赖关系
  output: {
    path: path.join(__dirname, "../docs/"),
    filename: "dev.js",
  },
  module: {
    rules: [
      {
        test: /.s[ac]ss$/,
        exclude: /.min.css$/,
        use: [
          { loader: "style-loader" },
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
        test: /.min.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
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
  devServer: {
    static: path.join(__dirname, "../docs/"),
    compress: true,
    host: "127.0.0.1",
    port: 8686, // 启动端口
    open: true, // 打开浏览器
  },
};
module.exports = merge(devConfig, baseConfig);
