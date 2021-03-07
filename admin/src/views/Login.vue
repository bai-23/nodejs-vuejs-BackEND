<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">

        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="model.password" type="password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: {},
      res: {
        data: {},
      }
    }
  },
  methods: {
    async login () {
      const res = await this.$http.post('login', this.model)
      localStorage.token = res.data.token  // 把后端传来的token保存到浏览器（关闭浏览器不清空）
      this.$router.push('/admin_users/list')  // 登陆成功跳转到后台页面
      this.$message({
        type: 'success',
        message: '登录成功'
      })  // 反馈服务器
    },
  },
}
</script>

<style scoped>
  .login-card {
    width: 25rem;
    margin: 5rem auto;
  }
</style>
