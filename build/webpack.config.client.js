const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge') // 用于合并webpack配置的包
const baseConfig = require('./webpack.base')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: { // 入口文件配置
    app: path.join(__dirname, '../client/app.js') // 使用path模块配置绝对路径
  },
  output: {
    filename: '[name].[hash].js' // [name]为输入文件名,[hash]为哈希值
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
})

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {// 如果出现错误，在浏览器中显示
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
