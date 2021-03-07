<template>
  <div class="about">
    <!--  根据id判断当前是编辑分类还是新建分类  -->
    <h1>{{ id ? '编辑' : '新建' }}物品</h1>

    <el-form label-width="120px" @submit.native.prevent="save">
      <!--<el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <el-option v-for="item in parents"
                     :key="item._id"
                     :label="item.name"
                     :value="item._id">
          </el-option>   label为显示的内容，value为实际保存的数据
        </el-select>
      </el-form-item> -->
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload">
          <!--   $http.defaults.baseURL即为 'http://localhost:3000/admin/api'      -->
          <img v-if="model.icon" :src="model.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "ItemEdit",
    props: {
      id: {}
    },
    data() {
      return {
        model: {},
      }
    },
    methods: {
      afterUpload(res) {
        this.$set(this.model, 'icon', res.url)  // 显示赋值
        // this.model.icon = res.url    // 这种可能赋不上（vue响应式原理）
      },
      async save() {
        let res
        if (this.id) {
          res = await this.$http.put(`rest/items/${this.id}`, this.model) // 修改分类
        } else {
          res = await this.$http.post('rest/items', this.model)   // 新建分类
        }

        this.$router.push('/items/list')
        this.$message({
          type: "success",
          message: '保存成功'
        })
        console.log(res.status)
      },
      async fetch() {
        const res = await this.$http.get(`rest/items/${this.id}`)
        this.model = res.data
      },

    },
    created() {
      this.id && this.fetch()
    }
  }
</script>

<style scoped>

</style>
