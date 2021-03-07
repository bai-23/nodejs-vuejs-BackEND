/*
*   登录校验中间件
* */
module.exports = options => {
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../models/AdminUser')

  return async (req, res, next) => {
    // 校验用户是否登录（中间件）
    // 1.获取用户信息id（前端传请求头）（Bearer 'token'）
    const token  = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请先登录（请提供jwt token）')

    const { id } = jwt.verify(token, req.app.get('secret')) // 解构赋值、解析、校验获取的id
    assert(id, 401, '请先登录（无效的jwt token）')

    req.user = await AdminUser.findById(id) // 通过id在数据库查找该id对应的用户
    assert(req.user, 401, '请先登录')
    await next()
  }
}

