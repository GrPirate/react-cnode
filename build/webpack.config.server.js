const path = require('path')

module.exports = {
  target: 'node', // webpack打包出来的内容是使用在哪个环境中的
  entry: { // 入口文件配置
    app: path.join(__dirname, '../client/server-entry.js') // 使用path模块配置绝对路径
  },
  output: {
    filename: 'server-entry.js', // [name]为输入文件名,[hash]为哈希值
    path: path.join(__dirname, '../dist'), // 文件输出路径
    publicPath: '/public',
    libraryTarget: 'commonjs2' // 规范
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules') // 除掉不需要编译的文件
        ]
      }
    ]
  }
}
