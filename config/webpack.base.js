module.exports = {
    resolve: {
        // 定义 import 引用时可省略的文件后缀名
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                // 编译处理 js/jsx 和 ts/tsx 文件
                test: /(\.js(x?))|(\.ts(x?))$/,
                use: [
                    { 
                        loader: 'babel-loader'
                    }
                ],
                exclude: /node_modules/, // 不编译node_modules，只解析 src 目录下的文件
            }
        ]
    },
}; 
