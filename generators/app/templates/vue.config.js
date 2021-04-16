var path = require('path')
var fs = require('fs')

const argvIndex = process.argv[3] === '--proname' ? 4 : 3
const entryFileName = process.argv[argvIndex] || 'index'
const entryPath = `src/view/${entryFileName}/main.js`

try {
  fs.statSync(path.join(__dirname, entryPath))
  console.log('存在该文件', entryPath)
} catch (e) {
  //捕获异常
  console.log('不存在该文件')
}
let PageConfig = {
  index: {
    entry: entryPath,
    template: 'src/public/index.html',
    filename: 'index.html',
    title: 'Index Page',
    chunks: ['chunk-vendors', 'chunk-common', 'index'],
  },
}
module.exports = {
  publicPath: './', // 官方要求修改路径在这里做更改，默认是根目录下，可以自行配置
  outputDir: 'dist_' + entryFileName, // 标识是打包哪个文件
  filenameHashing: false,
  // chainWebpack: (config) => {
  //   config.resolve.alias.set('@', resolve('src'))
  //   config.plugin('html').tap((args) => {
  //     // eslint-disable-next-line no-param-reassign
  //     args[0].title = 'bt-entry'
  //     return args
  //   })
  // },
  pages: PageConfig,
  productionSourceMap: false, // 生产环境 sourceMap
  devServer: {
    open: true, // 项目构建成功之后，自动弹出页面
    // host: 'localhost', // 主机名，也可以127.0.0.0 || 做真机测试时候0.0.0.0
    port: 8080, // 端口号，默认8080
    https: false, // 协议
    hotOnly: false, // 没啥效果，热模块，webpack已经做好了
    proxy: {
      '/api': {
        target: 'https://h5.yowin.mobi/api',
        changeOrigin: true,
      },
      '/ad': {
        target: 'http://101.251.197.221:82/ad',
        changeOrigin: true,
      },
    },
  },
}
