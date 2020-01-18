const path = require('path');// 引入node的path模块
const { CleanWebpackPlugin } = require('clean-webpack-plugin');// 使用{...}方式引入
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');// https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {// 打包入口配置
        index: path.resolve(__dirname, 'src/index.js')// 入口文件(名称:路径)
    },
    output: {// 打包出口配置
        path: path.resolve(__dirname, 'dist'),// 输出目录
        filename: 'library.js',
        library: 'library',// 若添加这个参数,则将该库命名为library绑定到window上,使得库可用<script></script>标签引入
        libraryTarget: 'umd'// umd参数使得库可以被任何一种模块规范方式引入
    },
    //externals: ['lodash'],// 指打包时忽略的库
    //externals: {
    //    lodash: 'lodash'
    //},
    module: {// 模块配置
        rules: [
            {// https://babeljs.io/docs/en/usage
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,// 不采用.babelrc的配置
                    presets: [
                        '@babel/preset-env'
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime', { corejs: 3 }]
                    ]
                }
            }
        ]
    },
    plugins: [// 插件可以在webpack生命周期中某些时刻做一些事情
        new CleanWebpackPlugin({}),
        new webpack.ProvidePlugin({
            //$: 'jquery',// 发现模块中有$则自动引入jquery
            //_join: ['lodash', 'join']// 表示自动将lodash模块中的join方法绑定到出现_join的模块中去
        })
    ],
    optimization: {
        // Tree Shaking 按需引入,忽略掉没有导出的内容(production默认使用)
        // 需要在package.js中设置"sideEffects": false
        // 若在package.js中设置"sideEffects": ["@babel/polyfill", "*.css", "*.less"],则说明@babel/polyfill不受 Tree Shaking 影响
        usedExports: true,
        minimizer: [
            new UglifyJsPlugin({})// 压缩js
        ]
    }
}