module.exports = {
  outputDir: __dirname + '/../server/admin',  // 编译生成的文件直接放到server文件夹里
  publicPath: process.env.NODE_ENV === 'production'
    ? '/admin'
    : '/',    // 编译后的html文件里的资源引用路径前都加上/admin/

  configureWebpack: {
    resolve: {
      alias: {
        'src': '@',
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}
