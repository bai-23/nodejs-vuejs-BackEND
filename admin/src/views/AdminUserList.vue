<template>
  <div>
    <h1>管理员列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="updateTime" label="上次修改">{{ this.today }}</el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="$router.push(`/admin_users/edit/${scope.row._id}`)">编辑</el-button>
          <!-- scope.row._id 表示当前这一行的id -->
          <el-button type="text" size="small"
                     @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import moment from 'moment'
  import jwt from "jsonwebtoken";

  export default {
    name: "AdminUserList",
    data(){
      return {
        items: [],
        modal: [],
        id: '',
        today: ''
      }
    },
    methods:{
      async fetch() {
        const res = await this.$http.get('rest/admin_users')
        this.items = res.data
      },
      async remove(row) {
        this.$confirm(`是否确定删除"${row.name}"`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`rest/admin_users/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetch() // 重新获取数据
        })
      },
      async lastLogin() {
        // 获取管理员名称
        const res = await this.$http.get('rest/admin_users')
        this.model = res.data
        this.today = moment().format('LLL')
        this.id = jwt.verify(localStorage.token, 'errs55454da')
        // 通过id查找管理员列表对应管理员
        this.model.forEach((item, index) => {
          if (item._id === this.id.id) {
            this.model[index].updateTime = this.today
            console.log(this.model[index].updateTime)
            this.$http.put(`rest/admin_users/${this.model[index]._id}`, this.model[index].updateTime) // 修改分类
          }
        })
      }
    },
    created() {
      this.lastLogin()
      this.fetch()
    }
  }
</script>

<style scoped>

</style>
