const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const htmlMinify = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: false, // do not remove type="text"
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
};

module.exports = [
  new HtmlWebpackPlugin({
    title: '몰몽 : moremong',
    favicon: paths.src + '/images/favicon.png',
    template: paths.html + '/fragments/header.html', // template file
    filename: paths.build + '/fragments/header.html', // output file,
    minify: htmlMinify,
    chunks: ['header'],
  }),
  new HtmlWebpackPlugin({
    title: '몰몽 : moremong',
    favicon: paths.src + '/images/favicon.png',
    template: paths.html + '/fragments/header-index.html', // template file
    filename: paths.build + '/fragments/header-index.html', // output file,
    minify: htmlMinify,
    chunks: ['header'],
  }),
  new HtmlWebpackPlugin({
    favicon: paths.src + '/images/favicon.png',
    template: paths.html + '/moremong.html', // template file
    filename: paths.build + '/moremong.html', // output file,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    favicon: paths.src + '/images/favicon.png',
    template: paths.html + '/copyrightApp.html', // template file
    filename: paths.build + '/copyrightApp.html', // output file,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/side.html', // template file
    filename: paths.build + '/fragments/side.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/worklog.html', // template file
    filename: paths.build + '/fragments/worklog.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/theme.html', // template file
    filename: paths.build + '/fragments/theme.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/user-avatar.html', // template file
    filename: paths.build + '/fragments/user-avatar.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/language.html', // template file
    filename: paths.build + '/fragments/language.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/footer.html', // template file
    filename: paths.build + '/fragments/footer.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/layout-main.html', // template file
    filename: paths.build + '/fragments/layout-main.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
  new HtmlWebpackPlugin({
    template: paths.html + '/fragments/layout-index.html', // template file
    filename: paths.build + '/fragments/layout-index.html', // output file,
    minify: htmlMinify,
    chunks: [],
  }),
];
