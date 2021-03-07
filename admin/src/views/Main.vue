<!--
  后台管理主页面
-->
<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router
               unique-opened
               :default-active="$route.path"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <!--    内容管理    -->
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>内容管理
          </template>

          <el-menu-item-group>
            <template slot="title">物品</template>
            <el-menu-item index="/items/create">新建物品</el-menu-item>
            <el-menu-item index="/items/list">物品列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">英雄</template>
            <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
            <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">文章</template>
            <el-menu-item index="/articles/create">新建文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>

        </el-submenu>

        <!--    运营管理    -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-share"></i>运营管理
          </template>

          <el-menu-item-group>
            <template slot="title">广告位</template>
            <el-menu-item index="/ads/create">新建广告位</el-menu-item>
            <el-menu-item index="/ads/list">广告位列表</el-menu-item>
          </el-menu-item-group>

        </el-submenu>

        <!--    系统设置    -->
        <el-submenu index="3">

          <template slot="title">
            <i class="el-icon-s-help"></i>系统设置
          </template>

          <el-menu-item-group>
            <template slot="title">分类</template>
            <el-menu-item index="/categories/create">新建分类</el-menu-item>
            <el-menu-item index="/categories/list">分类列表</el-menu-item>
          </el-menu-item-group>

          <el-menu-item-group>
            <template slot="title">管理员</template>
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
          </el-menu-item-group>

        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style=" font-size: 12px">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">

          <el-submenu index="2" class="items">
            <template slot="title">设置</template>
            <el-menu-item index="2-1">查看</el-menu-item>
            <el-menu-item index="2-2">新增</el-menu-item>
            <el-menu-item index="2-3">删除</el-menu-item>
          </el-submenu>

          <el-button type="text" @click="delUser" >注销</el-button>
          <el-menu-item index="1">
            管理员：<span>{{ this.user }}</span>
          </el-menu-item>

        </el-menu>
      </el-header>

      <el-main>
        <!-- 主页的子路由 -->
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import jwt from 'jsonwebtoken'

  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',

      };
      return {
        tableData: Array(20).fill(item),
        activeIndex: '1',
        activeIndex2: '1',
        model: [
          {username: ''}
        ],
        user: '[未登录]',
        id: ''
      }
    },
    methods: {
      queryIndex(id) {
        return id === this.model._id
      },

      async fetch() {
        // 获取管理员名称
        const res = await this.$http.get('rest/admin_users')
        this.model = res.data
        // console.log(this.model)
        // 通过token解析id
        this.id = jwt.verify(localStorage.token, 'errs55454da')
        // 通过id查找管理员列表对应管理员
        for (const value of this.model) {
          if (value._id === this.id.id) {
            this.user = value.username
          }
        }
      },
      async delUser() {
        localStorage.token = ''
        this.$router.push('/login')
      }
    },
    created() {
      this.fetch()
    },
  };
</script>

<style scoped>
  .el-header {
    background-color: #545c64;
    color: #333;
    line-height: 60px;
  }

  .el-menu-demo {
    max-width: 1500px;
  }
  .el-menu-demo .items {
    float: right;
  }
  .el-aside {
    color: #333;
  }
</style>
