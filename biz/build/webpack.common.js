const path = require('path');// 引入node的path模块
const autoprefixer = require('autoprefixer');// 处理css的浏览器厂商前缀兼容
const HtmlWebpackPlugin = require('html-webpack-plugin');// https://webpack.js.org/plugins/html-webpack-plugin/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// https://webpack.js.org/plugins/mini-css-extract-plugin/
const webpack = require('webpack');
const rootPath = path.dirname(__dirname, '..');

const theme = {
    'primary-color': 'red'
}

const commonConfig = {
    entry: {// 打包入口配置
        index: path.resolve(rootPath, 'src/index.js')// 入口文件(名称:路径)
    },
    output: {// 打包出口配置
        path: path.resolve(rootPath, 'dist')// 输出目录
    },
    module: {// 模块配置
        rules: [
            {// 规则项
                test: /\.(png|jpg|gif)$/i,// 匹配方式
                use: {
                    // https://webpack.js.org/loaders/url-loader/
                    loader: 'url-loader',// 指定loader
                    options: {// loader配置项
                        // 单位字节
                        // 大于该限制的图片使用文件形式,小于的使用base64
                        // 这么做可以减少小文件的http请求,又不至于让最终的js文件过大,导致加载缓慢
                        limit: 8192
                    }
                }
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                // loader顺序从最后往前执行
                // postcss-loader处理css的浏览器厂商前缀兼容
                // css-loader处理css模块间的依赖
                // style-loader负责将css挂载到html页面
                use: [
                    //'style-loader',
                    {
                        // https://webpack.js.org/plugins/mini-css-extract-plugin/
                        // 使用单独的css文件
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: () => process.env.NODE_ENV == 'development',
                            reloadAll: true
                        }                        
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,// css模块化
                            importLoaders: 1// 通过css中@import引入的文件也要走下边的postcss-loader
                        }
                    }, 
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [ autoprefixer() ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/i,
                exclude: /node_modules/,
                use: [
                    //'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: () => process.env.NODE_ENV == 'development',
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,// css模块化
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [ autoprefixer() ]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: theme
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                include: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1// 通过css中@import引入的文件也要走下边的postcss-loader
                        }
                    }, 
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [ autoprefixer() ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/i,
                include: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1// 通过css中@import引入的文件也要走下边的postcss-loader
                        }
                    }, 
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [ autoprefixer() ]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            //javascriptEnabled: true,// 解决antd报错问题
                            modifyVars: theme
                        }
                    }
                ]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                loader: '@svgr/webpack'
            }
        ]
    },
    plugins: [// 插件可以在webpack生命周期中某些时刻做一些事情
        new HtmlWebpackPlugin({ 
            template: path.resolve(rootPath, 'index.html'),
            title: 'biz'
        }),
        new MiniCssExtractPlugin({}),
        // 垫片
        /*
        new webpack.ProvidePlugin({
            $: 'jquery',// 发现模块中有$则自动引入jquery
            _join: ['lodash', 'join']// 表示自动将lodash模块中的join方法绑定到出现_join的模块中去
        })
        */
    ],
    optimization: {
        // Tree-Sharking
        usedExports: true,
        // https://webpack.js.org/plugins/split-chunks-plugin/
        // 代码分割,可将公用类库代码与业务代码分割,防止单js文件过大
        // 库代码不经常变动,发布新的业务代码还可使用旧的库代码缓存
        // 多js文件可被浏览器同时下载
        // 使用webpackChunkName可命名异步引用的库
        // return import(/* webpackChunkName:'lodash' */'lodash').then(({ default: _ }) => {
        //     let ele = document.createElement('div');
        //     ele.innerText = _.join(['f', 'w', 'k'], '**');
        //     return ele;
        // });
        // getComponent().then(ele => {
        //     document.body.appendChild(ele);
        // });
        // 生成了lodash.js
        splitChunks: {
            chunks: 'all',// async:只对异步代码生效;all:对所有代码生效;
            automaticNameDelimiter: '.'
        }
    }
}

module.exports = commonConfig;// CommonJS规范导出(node使用的包规范)