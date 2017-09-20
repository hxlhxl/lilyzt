const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const base = require('./base');
// const webpack-hot-middleware
//不要传空对象，和空数组（传空是replace，不是merge）

const ExtractCSS = new ExtractTextPlugin('css/[name].css')

module.exports = merge(base, {
    devtool: 'eval-source-map',
    entry: {
        // 不是调用node API，不需要
        // vendor: ['webpack-hot-middleware/client']
    },
    // output: {
    //   filename: 'js/[name].[hash:8].js',
    //   chunkFilename: 'js/[name].[chunkhash:8].js', // chunk就是commonsChunk插件后的变量
    // },
    module: {
        rules: [{
                test: /\.css$/,
                use: ExtractCSS.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        }
                    }]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractCSS.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },

            // {
            //     test: /\.scss$/,
            //     use: [
            //       'style-loader',
            //       'css-loader',
            //       'sass-loader'
            //     ]
            //   }
        ]
    },
    plugins: [
        // new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),  // WARNING in webpack: Using NoErrorsPlugin is deprecated.Use NoEmitOnErrorsPlugin instead.
        new webpack.NoEmitOnErrorsPlugin(),
        // 输出css
        ExtractCSS,
    ],
});