<template>
  <div>
    <el-form :label-position="left" label-width="80px">
      <el-row>
          <el-container>
            <el-header>
              <el-menu mode="horizontal" default-active="1">
                <el-menu-item index="1">通用</el-menu-item>
                <el-menu-item index="2">页脚</el-menu-item>
                <el-menu-item index="3">资料卡</el-menu-item>
              </el-menu>
            </el-header>

            <el-main>
              <component></component>
              <el-row>
                  <el-form-item label="配置项1">
                    <el-input style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="配置项2">
                    <el-input style="width: 200px"></el-input>
                  </el-form-item>
              </el-row>
            </el-main>

          </el-container>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SiteSetting"
}
</script>

<style scoped>
.el-container {
  background-color: #FFFFFF;
}

.el-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgb(241, 242, 243);
}

.el-menu {
  height: 100%;
  border-bottom: unset;
}

.el-menu-item {
  font-size: 16px;
}

.el-menu--horizontal>.el-menu-item:hover {
  background-color: unset;
}
</style>
