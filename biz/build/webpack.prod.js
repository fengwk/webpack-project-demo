const { CleanWebpackPlugin } = require('clean-webpack-plugin');// 使用{...}方式引入
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');// https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const prodConfig = {
    mode: 'production',// 打包模式:development、production(默认,会压缩代码)
    // 编译文件与源码映射
    // 建议development使用cheap-module-eval-source-map
    // production若需要使用cheap-module-source-map
    //devtool: 'cheap-module-source-map',
    output: {// 打包出口配置
        publicPath: '',// 发布路径,例如https://cdn.com,则最后index.html文件中会变为https://cdn.com/[name].js
        filename: '[name].[contenthash].js',// 输出文件名称,[name]占位符使用entry里的key
        chunkFilename: '[name].[contenthash].js'
    },
    plugins: [// 插件可以在webpack生命周期中某些时刻做一些事情
        new CleanWebpackPlugin({})
    ],
    module: {
        rules: [
            {// https://babeljs.io/docs/en/usage
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,// 不采用.babelrc的配置
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'// presets执行顺序也是从后往前,若使用了@babel/preset-env,则先执行@babel/preset-react
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime', { corejs: 3 }],
                        ['import', { libraryName: 'antd', style: true }, 'antd'],// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                        ['import', { libraryName: 'antd-mobile', style: true}, 'antd-mobile']// https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
                    ]
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),// 压缩css
            new UglifyJsPlugin({})// 压缩js
        ]
    }
}

module.exports = merge(commonConfig, prodConfig);// CommonJS规范导出(node使用的包规范)