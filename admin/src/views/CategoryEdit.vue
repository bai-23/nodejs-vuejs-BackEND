<template>
  <div class="about">
    <!--  根据id判断当前是编辑分类还是新建分类  -->
    <h1>{{ id ? '编辑' : '新建' }}分类</h1>

    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <el-option v-for="item in parents"
                     :key="item._id"
                     :label="item.name"
                     :value="item._id">
          </el-option>  <!-- label为显示的内容，value为实际保存的数据 -->
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "CategoryEdit",
    props: {
      id: {}
    },
    data() {
      return {
        model: {},
        parents: [],
      }
    },
    methods: {
      async save() {
        let res
        if (this.id) {
          res = await this.$http.put(`rest/categories/${this.id}`, this.model) // 修改分类
        } else {
          res = await this.$http.post('rest/categories', this.model)   // 新建分类
        }

        this.$router.push('/categories/list')
        this.$message({
          type: "success",
          message: '保存成功'
        })
        console.log(res.status)
      },
      async fetch() {
        const res = await this.$http.get(`rest/categories/${this.id}`)
        this.model = res.data
      },
      async fetchParents() {
        // 获取父级分类列表
        const res = await this.$http.get(`rest/categories`)
        this.parents = res.data
      },

    },
    created() {
      this.fetchParents()
      this.id && this.fetch()
    }
  }
</script>

<style scoped>

</style>
