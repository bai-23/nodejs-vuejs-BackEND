/*
*   前端后台网络请求封装
* */
import axios from 'axios'
import Vue from 'vue'
import router from './router/index'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/admin/api',
  // baseURL: 'http://localhost:3000/admin/api'
})

// 请求拦截器
http.interceptors.request.use(config => {
  if(localStorage.token) {
    // 给所有请求加一个Authorization请求头，“Bearer”表示类型，是行业规范
    config.headers.Authorization = 'Bearer ' + (localStorage.token || '')
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.data.message){
    Vue.prototype.$message({
      type: "error",
      message: err.response.data.message
    })
    if (err.response.status === 401) {
      router.push('/login')
    }
  }
  return Promise.reject(err)
})

export default http
