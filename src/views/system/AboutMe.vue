<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef" label-position="top">
      <el-row>
        <el-container>
          <el-header>
            <div style="border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
              关于我
            </div>
            <div>
              <el-button type="primary" @click="updatePageSetting">更新</el-button>
            </div>
          </el-header>
          <el-main>
            <el-row :gutter="20">
              <!-- 标题 -->
              <el-col :span="6">
                <el-form-item label="标题" prop="aboutTitle">
                  <el-input v-model="form.aboutTitle" placeholder="输入关于我页面标题"></el-input>
                </el-form-item>
              </el-col>
              <!-- 音乐配置 -->
              <el-col :span="6">
                <el-form-item label="音乐" prop="aboutMusicServer">
                  <el-input placeholder="输入歌曲ID" v-model="form.aboutMusicId">
                    <el-select style="width: 100px" v-model="form.aboutMusicServer" slot="prepend">
                      <el-option label="本系统" value="local"></el-option>
                      <el-option label="网易云" value="netease"></el-option>
                      <el-option label="腾讯" value="tencent"></el-option>
                      <el-option label="酷狗" value="kugou"></el-option>
                      <el-option label="虾米" value="xiami"></el-option>
                      <el-option label="百度" value="baidu"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <!-- 权限 -->
              <el-col :span="6">
                <el-form-item label="评论开关">
                  <el-switch v-model="form.aboutIsComment" true-label="true" false-label="false">评论</el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 正文内容 -->
            <el-form-item label="正文内容" prop="aboutContent">
              <mavon-editor :autofocus="false" :boxShadow="false" v-model="form.aboutContent"/>
            </el-form-item>
          </el-main>
        </el-container>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getAboutSetting, updateAboutSetting} from "@/api/About";

export default {
  name: "AboutMe",

  data() {
    return {
      form: {
        aboutTitle: null,
        aboutContent: null,
        aboutIsComment: false,
        aboutMusicId: null,
        aboutMusicServer: "netease"
      },
      formRules: {
        aboutTitle: [{required: true, message: '请输入标题', trigger: 'change'}],
        aboutContent: [{required: true, message: '请输入正文内容', trigger: 'change'}]
      }
    }
  },

  created() {
    this.getPageSetting();
  },

  methods: {
    //获取配置项
    getPageSetting() {
      getAboutSetting().then(res => {
        if (res.success) {
          this.form.aboutIsComment = res.data.aboutIsComment === "true";
          this.form.aboutMusicServer = res.data.aboutMusicServer;
          this.form.aboutMusicId = res.data.aboutMusicId;
          this.form.aboutTitle = res.data.aboutTitle;
          this.form.aboutContent = res.data.aboutContent
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //更新配置
    updatePageSetting() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          updateAboutSetting(this.form).then(res => {
            if (res.success) {
              Notification({
                title: '更新成功',
                type: 'success',
                duration: 1500
              })
              this.getPageSetting();
            } else {
              this.$message.error(res.msg);
            }
          })
        } else {
          return this.msgError('请填写必要的表单项')
        }
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  background-color: #FFFFFF;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgb(241, 242, 243);
}

.v-note-wrapper {
  font-family: inherit;
  letter-spacing: 1px;
  position: static !important;
  border: 1px solid rgb(220, 223, 230) !important;
}

::v-deep .v-note-op {
  z-index: unset !important;
}

.el-date-editor {
  width: 100%;
}
</style>
