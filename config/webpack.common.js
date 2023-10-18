const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');
const htmlMinify = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeConsole: true,
  removeComments: true,
  removeRedundantAttributes: false, // do not remove type="text"
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
};

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    /*** pages ***/
    index: paths.src + '/js/index.jsx',
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
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
    /*** pages ***/
    new HtmlWebpackPlugin({
      title: '몰몽 : moremong',
      favicon: paths.src + '/images/favicon.png',
      template: paths.html + '/index.html', // template file
      filename: paths.build + '/index.html', // output file,
      minify: htmlMinify,
      chunks: ['index'],
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
