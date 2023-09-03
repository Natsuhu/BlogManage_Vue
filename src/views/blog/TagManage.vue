<template>
  <div>
    <!-- 操作面板 -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索名称 -->
          <div>
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="搜索标签名称..."
                      style="width: 100%;" prefix-icon="el-icon-search"/>
          </div>
        </el-header>
      </el-container>
    </el-row>

    <el-row>
      <el-container>
        <el-header>
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            标签管理
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <!-- 新增按钮 -->
            <el-button @click="addTag()" size="medium" type="primary">新增</el-button>
            <!-- 刷新按钮 -->
            <el-button @click="getTableData(false)" size="medium" plain type="info" class="base_refresh_btn"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 标签表格 -->
          <el-table :data="tagTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">

            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip/>
            <el-table-column label="文章数量" prop="articleCount" width="200" align="center"/>
            <el-table-column label="标签颜色" width="220" align="center">
              <template slot-scope="scope">
                <el-button circle :style="'background-color:' + scope.row.color" size="mini"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="220" align="center"/>
            <el-table-column label="更新时间" prop="updateTime" width="220" align="center"/>

            <!-- 操作按钮 -->
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑标签" placement="top">
                  <i class="el-icon-edit-outline base_text_point base_margin_r" @click="changeTag(scope.row)" />
                </el-tooltip>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeTag(scope.row)">
                  <i slot="reference" class="el-icon-delete base_text_point"/>
                </el-popconfirm>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialog" model="false" model-append-to-body="false">

      <!-- 名称输入表单 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="输入标签名称"></el-input>
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
import {getTagTable, saveTag, updateTag, deleteTag} from "@/api/Tag"

export default {
  name: "TagManage",

  data() {
    return {
      visible: false,
      //保存标记，1新增2更新
      saveFlag: 0,
      //对话框标题：新增或更新
      dialogTitle: null,
      //对话框激活标记
      dialog: false,
      tagTable: [],
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
        name: null
      }
    }
  },

  watch: {
    //监听对话框关闭
    dialog: function (value) {
      if (!value) {
        this.saveFlag = 0;
        this.form.id = null;
        this.form.name = null;
      }
    }
  },

  created() {
    this.getTableData()
  },

  methods: {
    //获取标签表格
    getTableData(clearPageNo) {
      //重置到第一页
      if (clearPageNo != null && clearPageNo) {
        this.queryParam.pageNo = 1;
      }
      getTagTable(this.queryParam).then(res => {
        if (res.success) {
          this.tagTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //新增标签按钮
    addTag() {
      this.saveFlag = 1;
      this.dialog = true;
      this.dialogTitle = "新增标签";
      this.form.id = null;
      this.form.name = null;
    },
    //表格编辑标签按钮
    changeTag(row) {
      this.saveFlag = 2;
      this.dialog = true;
      this.dialogTitle = "编辑标签";
      this.form.id = row.id;
      this.form.name = row.name;
    },
    //对话框确定按钮
    submit() {
      if (this.saveFlag === 1) {
        saveTag(this.form).then(res => {
          if (res.success) {
            Notification({
              title: '新增成功',
              type: 'success',
              duration: 1500
            })
            //刷新表单,关闭对话框
            this.getTableData();
            this.dialog = false;
          } else {
            Notification({
              title: '新增失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
      if (this.saveFlag === 2) {
        updateTag(this.form).then(res => {
          if (res.success) {
            Notification({
              title: '更新成功',
              type: 'success',
              duration: 1500
            })
            //刷新表单,关闭对话框
            this.getTableData();
            this.dialog = false;
          } else {
            Notification({
              title: '更新失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    //表格删除按钮
    removeTag(row) {
      deleteTag(row).then(res => {
        if (res.success) {
          Notification({
            title: '删除成功',
            type: 'success',
            duration: 1500
          })
          //删除成功刷新表格
          this.getTableData();
        } else {
          Notification({
            title: '删除失败',
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
  /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);*/
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgb(241, 242, 243);
}

.el-icon-edit-outline {
  font-size: 1rem;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}

.el-icon-edit-outline:hover {
  color: #66ccff;
}

.el-icon-delete {
  font-size: 1rem;
  font-weight: 100;
  color: #F56C6C;
}
</style>
