import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import http from './http'

import './style.css'

Vue.config.productionTip = false
Vue.prototype.$http = http

// 全局添加getAuthHeaders()方法
Vue.mixin({
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods: {
    // 解决图片文件不能上传问题
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
