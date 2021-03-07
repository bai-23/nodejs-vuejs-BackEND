/*
*   资源数据模型获取中间件
*     匹配、解析前端网络请求传来的url
* */
module.exports = options => {
  return async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource) // categories转成Category
    req.Model = require(`../models/${modelName}`)
    next()
  }
}
