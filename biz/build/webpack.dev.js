const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
    mode: 'development',// 打包模式:development、production(默认,会压缩代码)
    // 编译文件与源码映射
    // 建议development使用cheap-module-eval-source-map
    // production若需要使用cheap-module-source-map
    devtool: 'cheap-module-eval-source-map',
    // https://webpack.js.org/configuration/dev-server/
    output: {// 打包出口配置
        filename: '[name].js',// 输出文件名称,[name]占位符使用entry里的key
        chunkFilename: '[name].js'
    },
    devServer: {
        contentBase: './dist',
        open: true,// true时启动webpack-server自动打开浏览器
        hot: true,// 打开热更新
        hotOnly: true,//只有热更新会刷新,浏览器不自动刷新
        port: 8000,
        historyApiFallback: true,// 将所有路径请求转为根路径请求,防止单页应用请求404
        /*
        // https://webpack.js.org/configuration/dev-server/#devserverproxy
        proxy: {
            '/api': 'http://localhost:3000'
        }
        */
    },
    module: {
        rules: [
            {// https://babeljs.io/docs/en/usage
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,// 不采用.babelrc的配置
                    presets: [
                        // npm i -D @babel/preset-env
                        /*
                        ['@babel/preset-env', {
                            // 要兼容到的目标浏览器
                            targets: {
                                "edge": "17",
                                "firefox": "60",
                                "chrome": "67",
                                "safari": "11.1",
                            },
                            //useBuiltIns: 'usage'// 按需加载@babel/polyfill,会污染全局环境,使用@babel/plugin-transform-runtime代替
                        }],
                        */
                        '@babel/preset-env',
                        '@babel/preset-react'// presets执行顺序也是从后往前,若使用了@babel/preset-env,则先执行@babel/preset-react
                    ],
                    // npm i -D @babel/plugin-transform-runtime
                    // npm i -S @babel/runtime-corejs2
                    plugins: [
                        'react-hot-loader/babel',
                        ['@babel/plugin-transform-runtime', { corejs: 3 }],
                        ['import', { libraryName: 'antd', style: true }, 'antd'],// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                        ['import', { libraryName: 'antd-mobile', style: true}, 'antd-mobile']// https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
                    ]
                }
            }
        ]
    },
    plugins: [// 插件可以在webpack生命周期中某些时刻做一些事情
        new webpack.HotModuleReplacementPlugin()// 热更新插件
    ]
}

module.exports = merge(commonConfig, devConfig);// CommonJS规范导出(node使用的包规范)