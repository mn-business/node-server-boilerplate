const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlFragments = require('./htmlFragments');

const paths = require('./paths');
const htmlMinify = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeConsole: true,
  removeComments: true,
  removeRedundantAttributes: false, // do not remove type="text"
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    header: paths.src + '/js/fragments/header.js',
    /*** pages ***/
    index: paths.src + '/js/index.jsx',
    userLogin: paths.src + '/js/user/login.js',
    /*** calendar ***/
    worklogIndex: paths.src + '/js/worklog/worklogIndex.jsx',
    worklogs: paths.src + '/js/worklog/worklogs.jsx',
    worklogReports: paths.src + '/js/worklog/worklogReports.jsx',
    worklogYetPayments: paths.src + '/js/worklog/worklogYetPayments.jsx',
    worklogMaster: paths.src + '/js/worklog/worklogMaster.jsx',
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/moreapp/dist/',
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    ...htmlFragments,
    /*** pages ***/
    new HtmlWebpackPlugin({
      template: paths.html + '/index.html', // template file
      filename: paths.build + '/index.html', // output file,
      minify: htmlMinify,
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: paths.html + '/user/login.html', // template file
      filename: paths.build + '/user/login.html', // output file,
      minify: htmlMinify,
      chunks: ['userLogin'],
    }),
    /*** calendar ***/
    new HtmlWebpackPlugin({
      template: paths.html + '/worklog/worklogIndex.html', // template file
      filename: paths.build + '/worklog/worklogIndex.html', // output file,
      minify: htmlMinify,
      chunks: ['worklogIndex'],
    }),
    new HtmlWebpackPlugin({
      template: paths.html + '/worklog/worklogs.html', // template file
      filename: paths.build + '/worklog/worklogs.html', // output file,
      minify: htmlMinify,
      chunks: ['worklogs'],
    }),
    new HtmlWebpackPlugin({
      template: paths.html + '/worklog/worklogReports.html', // template file
      filename: paths.build + '/worklog/worklogReports.html', // output file,
      minify: htmlMinify,
      chunks: ['worklogReports'],
    }),
    new HtmlWebpackPlugin({
      template: paths.html + '/worklog/worklogYetPayments.html', // template file
      filename: paths.build + '/worklog/worklogYetPayments.html', // output file,
      minify: htmlMinify,
      chunks: ['worklogYetPayments'],
    }),
    new HtmlWebpackPlugin({
      template: paths.html + '/worklog/worklogMaster.html', // template file
      filename: paths.build + '/worklog/worklogMaster.html', // output file,
      minify: htmlMinify,
      chunks: ['worklogMaster'],
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.(js|jsx)$/, use: ['babel-loader'] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
      build: paths.build,
    },
  },
};
