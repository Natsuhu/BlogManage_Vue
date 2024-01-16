<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-form-item label="博客名称" prop="blogName">
        <el-input v-model="form.blogName" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="网页标题后缀" prop="webTitleSuffix">
        <el-input v-model="form.webTitleSuffix" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CommonSetting",

  data() {
    return {
      form: {
        blogName: null,
        webTitleSuffix: null
      }
    }
  }
}
</script>

<style scoped>

</style>
