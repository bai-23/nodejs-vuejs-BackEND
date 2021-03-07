const express = require('express')

const app = express()

app.set('secret', 'errs55454da')  //  全局设置生成token的参数变量

app.use(require('cors')()) //跨域模块
app.use(express.json())
app.use('/', express.static(__dirname + '/web'))  // 开放静态资源/web, 表示把静态文件夹web托管到根路径
// 前面那个/admin，对应admin文件夹里面的vue.config.js的publicPath选项下的参数
// 测试后记得清空浏览器token（localStorage.clear()）
app.use('/admin', express.static(__dirname + '/admin'))  // 开放静态资源/admin，表示把静态文件夹托管到admin
app.use('/uploads', express.static(__dirname + '/uploads'))  // 开放静态资源/uploads

require('./plugins/db')(app)
require('./routes/admin')(app)  // 将app传给子路由
require('./routes/web')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
