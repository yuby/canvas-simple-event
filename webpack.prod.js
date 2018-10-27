const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'canvas-simple-event.js',
    library: 'canvasSimpleEvent',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: {
    canvasSimpleEvent: {
      commonjs: 'canvasSimpleEvent',
      commonjs2: 'canvasSimpleEvent',
      amd: 'canvasSimpleEvent',
      root: 'canvasSimpleEvent',
    },
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(['dist']),
  ],
};
