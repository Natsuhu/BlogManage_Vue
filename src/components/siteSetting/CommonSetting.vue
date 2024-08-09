<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="博客名称" prop="blogName">
            <el-input v-model="form.blogName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="首图标题" prop="headerTitle">
            <el-input v-model="form.headerTitle" size="small"></el-input>
          </el-form-item>
          <el-form-item label="博主评论标识" prop="adminCommentLabel">
            <el-input v-model="form.adminCommentLabel" size="small"
                      placeholder="填写后会在评论时带上博主标记"></el-input>
          </el-form-item>
          <el-form-item label="网页标题后缀" prop="webTitleSuffix">
            <el-input v-model="form.webTitleSuffix" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首图" prop="headerImage">
            <el-input v-model="form.headerImage" size="small"
                      placeholder="可填写文件ID或外部链接，不填写则不展示首图"></el-input>
          </el-form-item>
          <el-form-item label="背景图" prop="bodyImage">
            <el-input v-model="form.bodyImage" size="small"
                      placeholder="可填写文件ID或外部链接，不填写则背景为白色"></el-input>
          </el-form-item>
          <el-form-item label="前台登录页背景" prop="frontLoginImage">
            <el-input v-model="form.frontLoginImage" size="small"
                      placeholder="可填写文件ID或外部链接，不填写则不展示"></el-input>
          </el-form-item>
          <el-form-item label="后台登录页背景" prop="backLoginImage">
            <el-input v-model="form.backLoginImage" size="small"
                      placeholder="可填写文件ID或外部链接，不填写则不展示"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-form-item>
              <el-button @click="updateSetting" type="primary">保存</el-button>
            </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getCommonSetting, updateCommonSetting} from "@/api/Setting";

export default {
  name: "CommonSetting",

  data() {
    return {
      form: {
        blogName: null,
        webTitleSuffix: null,
        headerTitle: null,
        headerImage: null,
        bodyImage: null,
        adminCommentLabel: null,
        frontLoginImage: null,
        backLoginImage: null
      }
    }
  },

  created() {
    this.getSetting();
  },

  destroyed() {
    this.form.blogName = null;
    this.form.webTitleSuffix = null;
  },

  methods: {
    getSetting() {
      getCommonSetting().then(res => {
        if (res.success) {
          this.form.blogName = res.data.blogName;
          this.form.webTitleSuffix = res.data.webTitleSuffix;
          this.form.headerTitle = res.data.headerTitle;
          this.form.headerImage = res.data.headerImage;
          this.form.bodyImage = res.data.bodyImage;
          this.form.adminCommentLabel = res.data.adminCommentLabel;
          this.form.frontLoginImage = res.data.frontLoginImage;
          this.form.backLoginImage = res.data.backLoginImage;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    updateSetting() {
      updateCommonSetting(this.form).then(res => {
        if (res.success) {
          Notification({
            title: '更新成功',
            type: 'success',
            duration: 1500
          })
        } else {
          Notification({
            title: '更新失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
