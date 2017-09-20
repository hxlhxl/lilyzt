const path = require('path');
const env = process.env.NODE_ENV;

const config = require('./config');
require('babel-polyfill')
const webpack = require('webpack');
// 可以提取CSS
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const renderTpl = require('./tpl');

let sPath, publicPath, smap, htmlName, babelPresets, cachePath;
if (env === 'development') {
    sPath = 'debug';
    // publicPath = '/debug/';
    // publicPath = '/';
    publicPath = config.publicPath;
    smap = '?sourceMap';
    htmlName = 'index-dev.html';
    babelPresets = ['es2017', 'es2016', 'es2015'];
    cachePath = 'webpack-cache'
} else {
    sPath = 'public';
    // publicPath = '/public';
    publicPath = config.publicPath;
    smap = '';
    htmlName = 'index.html';
    babelPresets = ['es2017', 'es2016', 'es2015'];
    cachePath = false;
}

const clientPath = path.resolve(__dirname, '../app');
const serverPath = path.resolve(__dirname, `../server`);
const distPath = path.resolve(__dirname, `../server/${sPath}`);
const configPath = path.resolve(__dirname, '../app/config');
const nodePath = path.resolve(__dirname, '../node_modules');
const bowerPath = path.resolve(__dirname, '../bower_components');

const cwd = process.cwd();
const pkgFile = cwd + '/package.json'
const pkg = require(pkgFile);

console.log(`\x1b[33m ContentMode is ${env},${env} to path  : \x1b[0m`, distPath);

const tool = path.resolve(clientPath, 'utils/tool');
const date = Date.now();

function getEntry() {
    const entries = ['base', 'index','tags', 'archive', 'about'];
    return entries.map(entry => ({
            [entry]: `${clientPath}/libs/${entry}/index.js`
        }))
        .reduce((prev, curr, index, arr) => Object.assign(prev, curr), {});
}
module.exports = {
    entry: Object.assign({
        // index: `${clientPath}/index.js`,
        // vendor: Object.keys(pkg.devDependencies)    // 太大
        vendor: ['jquery'] // 太大
    }, getEntry()),
    output: {
        // 表示html中js等资源的路径
        publicPath,
        path: distPath,
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
                // https://github.com/babel/babel-loader
                test: /.js[x]?$/,
                exclude: [nodePath, bowerPath],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: babelPresets,
                        plugins: [
                            // 专用于antd
                            // ["import", { "libraryName": "antd", "style": 'css', }]
                        ],
                        cacheDirectory: cachePath
                    }
                }]
            },
            // jade
            {
                test: /\.pug$/,
                exclude: [nodePath, bowerPath],
                use: {
                    loader: 'pug-loader',
                    options: {
                        // limit: 81920,
                        // name: 'img/[name].[hash:8].[ext]'
                        self: true, // Use `self` namespace to hold the locals
                    }
                },
            },
            // 匹配到就按照name放置在编译输出目录下
            {
                test: /\.(gif|png|jpe?g)\??.*$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 81920,
                        name: 'img/[name].[hash:8].[ext]'
                    }
                },
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)\??.*$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 81920,
                        name: `css/iconfont/[hash:8].[ext]?t=${date}`
                    }
                }
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery',
                }, {
                    loader: 'expose-loader',
                    options: '$',
                }]
            },

        ]
    },
    plugins: [
        new WebpackMd5Hash(),
        // 这个东西如何理解感觉没啥意义，本质上只要vendor文件没有变化就好，
        // 具体issue在这里： https://github.com/webpack/webpack/issues/1315
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // 表示对entry中的所有资源进行公共提取
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // The chunk name of the commons chunk. An existing chunk can be selected by passing a name of an existing chunk.
            // If an array of strings is passed this is equal to invoking the plugin multiple times for each chunk name.
            name: 'manifest', // 表示公共模块的文件名称
            // Select the source chunks by chunk names. The chunk must be a child of the commons chunk.
            //  If omitted all entry chunks are selected.
            chunks: ['vendor'], // 然后从以上的common chunks vendor中选名字
        }),

        // 提取了两个之后[manifest.js,vendor.js]，都要放到html中，webpack才能生效

        // 将变量全局暴露，可以直接使用$t,而不用引入
        new webpack.ProvidePlugin({
            $t: tool,
            $: 'jquery',
            jQuery: 'jquery',
        }),
        // 把某些文件复制到输出目录下的js目录中
        new CopyWebpackPlugin([{
            from: `${clientPath}/sources/lib`,
            to: 'js'
        }]),
        // 把js、css标签注入到html中，并且移动到目标路径,这里是相对于输出目录
        // new HtmlWebpackPlugin({
        //     template: `${clientPath}/index.html`,
        //     inject: true,
        //     filename: `../views/${htmlName}`
        // }),

        ...renderTpl(),
        // DefinePlugin 允许创建一个在编译时可以配置的全局常量。
        // 工作原理是直接进行文本替换,和C++中的宏差不多
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(env)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new WriteFileWebpackPlugin(),
    ],
    resolve: {
        modules: [
            nodePath,
        ],
        extensions: [
            '.js',
            '.jsx',
            // babelcore Can't resolve '../../package'
            '.json',
            '.jade',
            '.pug',
            '.ts',
            '.css',
            '.scss',
        ],
        alias: {
            components: path.resolve(clientPath, './components'),
            utils: path.resolve(clientPath, './utils'),
        },
    },
    // 解决web项目中webpack Can't resolve 'fs'的问题
    node: {
        fs: "empty"
    },
    //  关闭一些 警告
    // stats: {
    //     warnings: false
    // },
    // devServer: {
    //     host: '0.0.0.0',
    //     port: '9999',
    //     compress: true,
    //     contentBase: [
    //         serverPath + '/debug',
    //         serverPath + '/views',
    //     ],
    //     headers: {
    //         'LILY': 'CANDY'
    //     },
    //     historyApiFallback: true,
    // },
    devServer: {
        // hot: true,
        host: '0.0.0.0',
        port: '9999',
        compress: true,
        publicPath: 'http://0.0.0.0:9999/debug/',   // 这种方式可以，其他的感觉都不行

        contentBase: serverPath + '/views',
        headers: {
            'LILY': 'CANDY'
        },
        historyApiFallback: true,
        staticOptions: {
            dotfiles: 'allow',
            index: 'index.html',
        }
    }
}