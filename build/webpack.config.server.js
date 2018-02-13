const path = require('path')
const webpackMerge = require('webpack-merge') // 用于合并webpack配置的包
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
  target: 'node', // webpack打包出来的内容是使用在哪个环境中的
  entry: { // 入口文件配置
    app: path.join(__dirname, '../client/server-entry.js') // 使用path模块配置绝对路径
  },
  output: {
    filename: 'server-entry.js', // [name]为输入文件名,[hash]为哈希值
    libraryTarget: 'commonjs2' // 规范
  }
})
