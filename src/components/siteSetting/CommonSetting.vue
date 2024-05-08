<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-form-item label="博客名称" prop="blogName">
        <el-input v-model="form.blogName" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="网页标题后缀" prop="webTitleSuffix">
        <el-input v-model="form.webTitleSuffix" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="首图标题" prop="headerTitle">
        <el-input v-model="form.headerTitle" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="首图" prop="headerImage">
        <el-input v-model="form.headerImage" style="width: 30%" size="small" placeholder="可填写文件ID或外部链接，不填写则不展示首图"></el-input>
      </el-form-item>
      <el-form-item label="博客背景图" prop="bodyImage">
        <el-input v-model="form.bodyImage" style="width: 30%" size="small" placeholder="可填写文件ID或外部链接，不填写则背景为白色"></el-input>
      </el-form-item>
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
        bodyImage: null
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
