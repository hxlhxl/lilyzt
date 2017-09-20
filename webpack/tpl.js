const cwd = process.cwd();
const config = require('./config');

const tplPath = cwd + '/app/views';

// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function renderTpl() {
    const pages = ['index','tags','archive','about'];
    return pages.map(page => {
        return new HtmlWebpackPlugin({
            filename: `../views/${page}.html`,
            template: `${tplPath}/${page}.pug`,
            inject: false,
            current: `${page}`,
            base: `base`,
            baseCss: `base`,
            staticPath: config.publicPath,
            pluginVar_1:'aaaaxa',
        })
    });
}
module.exports = renderTpl;
// nodejs不支持这种模块管理方式
// export default renderTpl;
