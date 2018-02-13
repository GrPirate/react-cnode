const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs')// 在内存中读写文件
const proxy = require('http-proxy-middleware')// express中间件
const ReactDomServer = require('react-dom/server')

// 引入webpack.config.server
const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => { // 从客户端获取HTML模板内容
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor

const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig) // 启动webpack.config.server的Compiler
serverCompiler.outputFileSystem = mfs// 使文件都通过mfs读写
let serverBundle
// 监听webpack配置中entry下的输入文件变化
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )

  const bundle = mfs.readFileSync(bundlePath, 'utf-8')

  const m = new Module()
  m._compile(bundle, 'server-entry.js')// module解析bundle生成一个模块，注意：需要指定一个文件
  serverBundle = m.exports.default
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<app></app>', content))
    })
  })
}
