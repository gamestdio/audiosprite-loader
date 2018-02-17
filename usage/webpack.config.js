const webpack = require('webpack')
const path = require('path')

const AudioSprite = require('../lib');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(options) {
  return {
    entry: path.resolve('index.js'),

    output: {
      path: __dirname + "/dist",
      filename: '[name].js'
    },

    devtool:  'cheap-source-map',

    module: {
      rules: [
        { test: /\.(wav|mp3)$/, use: AudioSprite.loader() }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve("index.html")
      }),
      new AudioSprite.Plugin()
    ],

    resolve: {
      extensions: ['.ts', '.js', '.json']
    }
  }
};
