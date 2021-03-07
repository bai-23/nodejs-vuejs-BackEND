<template>
  <div class="about">
    <!--  根据id判断当前是编辑分类还是新建分类  -->
    <h1>{{ id ? '编辑' : '新建' }}文章</h1>

    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <el-option v-for="item in categories"
                     :key="item._id"
                     :label="item.name"
                     :value="item._id">
          </el-option>  <!-- label为显示的内容，value为实际保存的数据 -->
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor v-model="model.body"
                    useCustomImageHandler
                    @image-added="handleImageAdded"></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { VueEditor } from "vue2-editor";

  export default {
    name: "ArticleEdit",
    props: {
      id: {}
    },
    components: {
      VueEditor
    },
    data() {
      return {
        model: {},
        categories: [],
      }
    },
    methods: {
      async save() {
        let res
        if (this.id) {
          res = await this.$http.put(`rest/articles/${this.id}`, this.model) // 修改分类
        } else {
          res = await this.$http.post('rest/articles', this.model)   // 新建分类
        }

        this.$router.push('/articles/list')
        this.$message({
          type: "success",
          message: '保存成功'
        })
        console.log(res.status)
      },
      async fetch() {
        const res = await this.$http.get(`rest/articles/${this.id}`)
        this.model = res.data
      },
      async fetchCategories() {
        // 获取父级分类列表
        const res = await this.$http.get(`rest/categories`)
        this.categories = res.data
      },

      async handleImageAdded(file, Editor, cursorLocation, resetUploader) {

        const formData = new FormData();
        formData.append("file", file);

        const res = await this.$http.post('upload', formData)
        Editor.insertEmbed(cursorLocation, "image", res.data.url);
        resetUploader();
      }

    },
    created() {
      this.fetchCategories()
      this.id && this.fetch()
    }
  }
</script>

<style scoped>

</style>
