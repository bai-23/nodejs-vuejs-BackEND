/*
*   后台网络请求接口/路由
* */
module.exports = app => {

  const express = require('express')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../../models/AdminUser')
  const assert = require('http-assert')

  const router = express.Router({
    mergeParams: true  // 合并参数
  }) // 定义一个子路由
  // const Category = require('../../models/Category') 加载分类数据库

  // 新建资源数据
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model) // 将获取的model发送给前端
  })
  // 更新分类数据
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 获取分类列表资源接口
  // populate('parent') 查询关联该该字段的对象
  // req.params.resource为类名（小写负数）
  router.get('/', async (req, res) => {
    const queryOptions = {}
    if(req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(100)
    res.send(items) // 将获取的items发送给前端
  })

  // 删除分类资源接口
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  // 获取详情页某一分类详情接口
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth.js')
  // 资源数据模型获取中间件
  const resourceMiddleware = require('../../middleware/resource.js')

  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router) // 将子路由挂载到api接口上

  // 上传路由接口
  const multer = require('multer')
  const upload = multer({dest: __dirname + '/../../uploads'})  // 定义上传目标
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // 登录请求
  app.post('/admin/api/login', async (req, res) => {
    const {username, password} = req.body
    // 1.根据用户名找用户
    const user = await AdminUser.findOne({username}).select('+password')
    assert(user, 422, '此用户不存在')
    // if (!user){
    //   return res.status(422).send({
    //     message: '用户不存在'  // 发给前端弹出框
    //   })
    // }

    // 2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)  // 比较密码
    assert(isValid, 422, '账号或密码错误')

    // 3.返回给客户端token
    //  根据用户id + secret生成token
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    res.send({ token })
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message,
    })
  })
}
