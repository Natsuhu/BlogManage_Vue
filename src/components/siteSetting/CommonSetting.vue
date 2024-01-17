<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-form-item label="博客名称" prop="blogName">
        <el-input v-model="form.blogName" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="网页标题后缀" prop="webTitleSuffix">
        <el-input v-model="form.webTitleSuffix" style="width: 30%" size="small"></el-input>
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
        webTitleSuffix: null
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
