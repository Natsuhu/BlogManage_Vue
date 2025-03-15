<template>
  <div>
    <!-- 操作面板 -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索名称 -->
          <div>
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="用户名"
                      style="width: 100%;" prefix-icon="el-icon-search"/>
          </div>
        </el-header>
      </el-container>
    </el-row>

    <el-row>
      <el-container>
        <el-header>
          <div style="border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">用户管理</div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <!-- 刷新按钮 -->
            <el-button @click="getTableData(false)" size="medium" plain type="info" class="base_refresh_btn"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 用户表格 -->
          <el-table :data="userTable" class="base_margin_b_large">
            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="头像" align="center">
              <template slot-scope="scope">
                <!--  给此组件绑定一个key，以解决src更新后，图片没及时更新的问题  -->
                <el-avatar shape="square" size="medium" :src="scope.row.avatar" :key="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="昵称" prop="username" align="center" show-overflow-tooltip/>
            <el-table-column label="邮箱" prop="email" align="center" show-overflow-tooltip/>
            <el-table-column label="权限" prop="role" align="center" show-overflow-tooltip/>
            <el-table-column label="创建时间" prop="createTime" width="270" align="center"/>
            <el-table-column label="更新时间" prop="updateTime" width="270" align="center"/>
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <!-- <i class="el-icon-edit-outline"/>
                <i class="el-icon-delete"/> -->
                <el-tooltip effect="dark" content="修改密码" placement="top">
                  <i class="el-icon-edit-outline base_text_point" @click="changeUser(scope.row)"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="queryParam.pageNo"
                         :page-sizes="[10, 20, 30]" :page-size="queryParam.pageSize" :page-count="totalPage"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper" background style="float: right;"
                         class="base_margin_b">
          </el-pagination>
        </el-main>
      </el-container>
    </el-row>

    <!-- 新增/修改对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" :lock-scroll="false">
      <!-- 名称输入表单 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="新密码" prop="name">
          <el-input show-password v-model="form.password" placeholder="输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getUserTable, updatePassword} from "@/api/User"

export default {
  name: "UserManage",
  data() {
    return {
      //对话框标题：新增或更新
      dialogTitle: null,
      //对话框激活标记
      dialog: false,
      userTable: [],
      totalPage: 0,
      total: 0,
      queryParam: {
        keyword: null,
        pageNo: 1,
        pageSize: 10
      },
      //更新&新增提交表单
      form: {
        id: null,
        password: null
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    //获取分类表格
    getTableData(clearPageNo) {
      //重置到第一页
      if (clearPageNo != null && clearPageNo) {
        this.queryParam.pageNo = 1;
      }
      getUserTable(this.queryParam).then(res => {
        if (res.success) {
          this.userTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //表格编辑分类按钮
    changeUser(row) {
      this.dialog = true;
      this.dialogTitle = "修改密码";
      this.form.id = row.id;
      this.form.password = null;
    },
    //对话框确定按钮
    submit() {
      updatePassword(this.form).then(res => {
        if (res.success) {
          Notification({
            title: '修改密码成功',
            type: 'success',
            duration: 1500
          })
          //刷新表单,关闭对话框
          this.dialog = false;
        } else {
          Notification({
            title: '修改密码失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //分页监听，新pageNo
    handleSizeChange(newSize) {
      this.queryParam.pageSize = newSize
      this.getTableData()
    },
    //分页监听，新pageSize
    handleCurrentChange(newPage) {
      this.queryParam.pageNo = newPage
      this.getTableData()
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
.el-icon-edit-outline {
  font-size: 1.2rem;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}
.el-icon-edit-outline:hover {
  color: #66ccff;
}
</style>