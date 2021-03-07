<template>
  <div class="about">
    <!--  根据id判断当前是编辑分类还是新建分类  -->
    <h1>{{ id ? '编辑' : '新建' }}英雄</h1>

    <el-form label-width="120px" @submit.native.prevent="save">
      <el-tabs value="basic" type="border-card">   <!-- value表示默认显示哪一个内容, 默认第一个 -->

        <el-tab-pane label="基本信息" name="basic">

          <el-form-item label="名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>

          <el-form-item label="称号">
            <el-input v-model="model.title"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="afterUpload">
              <!--   $http.defaults.baseURL即为 'http://localhost:3000/admin/api'      -->
              <img v-if="model.avatar" :src="model.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="Banner">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'banner', res.url)">
              <img v-if="model.banner" :src="model.banner" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="类型">
            <el-select v-model="model.categories" multiple>
              <el-option v-for="item in categories"
                         :key="item._id"
                         :label="item.name"
                         :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="难度">
            <el-rate :max='9' show-score v-model="model.scores.difficult" style="margin-top:0.6rem;"></el-rate>
          </el-form-item>
          <el-form-item label="技能">
            <el-rate :max='9' show-score v-model="model.scores.skills" style="margin-top:0.6rem;"></el-rate>
          </el-form-item>
          <el-form-item label="攻击">
            <el-rate :max='9' show-score v-model="model.scores.attack" style="margin-top:0.6rem;"></el-rate>
          </el-form-item>
          <el-form-item label="生存">
            <el-rate :max='9' show-score v-model="model.scores.survive" style="margin-top:0.6rem;"></el-rate>
          </el-form-item>

          <el-form-item label="顺风出装">
            <el-select v-model="model.items1" multiple>
              <el-option v-for="item in items"
                         :key="item._id"
                         :label="item.name"
                         :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逆风出装">
            <el-select v-model="model.items2" multiple>
              <el-option v-for="item in items"
                         :key="item._id"
                         :label="item.name"
                         :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="使用技巧">
            <el-input type="textarea" v-model="model.usageTips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input type="textarea" v-model="model.battleTips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input type="textarea" v-model="model.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="技能" name="skills">
          <el-button size="small" @click="model.skills.push({})"><i class="el-icon-plus"></i> 添加技能</el-button>
          <el-row type="flex" style="flex-wrap:wrap;">
            <el-col :md="12" v-for="(item, i) in model.skills" :key="i">
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="res => $set(item, 'icon', res.url)">
                  <img v-if="item.icon" :src="item.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="冷却值">
                <el-input v-model="item.delay"></el-input>
              </el-form-item>
              <el-form-item label="消耗">
                <el-input v-model="item.cost"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="item.description" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="提示">
                <el-input v-model="item.tips" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger"
                           @click="model.skills.splice(i, 1)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="最佳搭档" name="partners">
          <el-button size="small" @click="model.partners.push({})">
            <i class="el-icon-plus"></i> 添加英雄
          </el-button>
          <el-row type="flex" style="flex-wrap:wrap;">
            <el-col :md="12" v-for="(item, i) in model.partners" :key="i">
              <el-form-item label="英雄">
                <el-select v-model="item.hero" filterable>
                  <el-option v-for="hero in heroes"
                             :key="hero._id"
                             :value="hero._id"
                             :label="hero.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="item.description" type="textarea"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button size="small" type="danger"
                           @click="model.partners.splice(i, 1)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-form-item style="margin-top: 1rem;">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "HeroEdit",
    props: {
      id: {}
    },
    data() {
      return {
        categories: [],
        items: [],
        heroes: [],
        model: {  // 英雄数据模型
          name: '',
          avatar: '',
          partners: [],
          scores: {
            difficult: 0,
            skills: 0,
            attack: 0,
            survive: 0
          }, // 评分
          skills: [],
        },

      }
    },
    methods: {
      afterUpload(res) {
        // this.$set(this.model, 'avatar', res.url)  // 显示赋值
        this.model.avatar = res.url    // 在data中绑定了avatar
      },
      async save() {
        let res
        if (this.id) {
          res = await this.$http.put(`rest/heroes/${this.id}`, this.model) // 修改分类
        } else {
          res = await this.$http.post('rest/heroes', this.model)   // 新建分类
        }

        this.$router.push('/heroes/list')
        this.$message({
          type: "success",
          message: '保存成功'
        })
        console.log(res.status)
      },
      // 获取数据
      async fetch() {
        const res = await this.$http.get(`rest/heroes/${this.id}`)
        // this.model = res.data  此写法会将服务端拿到的数据完全覆盖该组件data中定义的model
        this.model = Object.assign({}, this.model, res.data)
        // 有difficult属性就不会被覆盖，没有就覆盖
      },
      async fetchCategories() {
        const res = await this.$http.get(`rest/categories`)
        this.categories = res.data
      },
      async fetchItems() {
        const res = await this.$http.get(`rest/items`)
        this.items = res.data
      },
      async fetchHeroes() {
        const res = await this.$http.get(`rest/heroes`)
        this.heroes = res.data
      },

    },
    created() {
      this.fetchHeroes()
      this.fetchItems()
      this.fetchCategories()
      this.id && this.fetch()
    }
  }
</script>

<style scoped>

</style>
