<template>
  <div>
    <!-- 操作面板 -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索名称 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="昵称 "
                      style="width: 100%;" prefix-icon="el-icon-search"/>
          </div>

          <!-- 选择是否公开 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.isPublished" @input="getTableData(true)" clearable placeholder="是否公开">
              <el-option label="公开" :value="true"/>
              <el-option label="隐藏" :value="false"/>
            </el-select>
          </div>

          <!-- 时间范围 -->
          <div class="base_margin_r">
            <el-date-picker type="daterange" v-model="queryParam.time" @input="getTableData(true)" range-separator="至"
                            start-placeholder="开始时间"
                            value-format="yyyy-MM-dd" clearable end-placeholder="结束时间" placeholder="选择时间范围"/>
          </div>
        </el-header>
      </el-container>
    </el-row>

    <!--  友链管理表格  -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header style="border-bottom: 2px solid rgb(241, 242, 243);">
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            友链管理
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <el-button @click="addFriend" size="medium" type="primary">新增</el-button>
            <el-button @click="getTableData(false)" size="medium" plain type="info"
                       class="base_refresh_btn base_margin_l_small"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 文件表格 -->
          <el-table :data="friendTable" class="base_margin_b_large">
            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="头像" align="center">
              <template slot-scope="scope">
                <!--  给此组件绑定一个key，以解决src更新后，图片没及时更新的问题  -->
                <el-avatar shape="square" size="medium" :src="scope.row.avatar" :key="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="昵称" prop="nickname" align="center" show-overflow-tooltip/>
            <el-table-column label="描述" prop="description" align="center" show-overflow-tooltip/>
            <el-table-column label="网站" prop="website" align="center"/>
            <el-table-column label="点击数" prop="click" align="center" width="120"/>
            <el-table-column label="公开" prop="isPublished" align="center" width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isPublished" @change="updateFriendAtt(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" width="160"/>
            <el-table-column label="更新时间" prop="updateTime" align="center" width="160"/>

            <!-- 操作按钮 -->
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="访问" placement="top">
                  <a :href="scope.row.website" target="_blank" class="el-icon-view base_text_point"></a>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit-outline base_text_point base_margin_lr" @click="changeFriend(scope.row)"/>
                </el-tooltip>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeFriend(scope.row)">
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

    <!--  友链页面内容编辑区  -->
    <el-form label-position="top">
      <el-row>
        <el-container>
          <el-header style="border-bottom: 2px solid rgb(241, 242, 243);">
            <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
              页面设置
            </div>
            <div style="width: 50%; display: flex; justify-content: flex-end">
              <el-button @click="updatePageSetting" size="medium" type="primary">更新</el-button>
              <el-button @click="getPageSetting" size="medium" plain type="info"
                         class="base_refresh_btn base_margin_l_small"
                         icon="el-icon-refresh-right"/>
            </div>
          </el-header>
          <el-main>
            <!-- 是否允许评论 -->
            <el-form-item label="是否开启评论">
              <el-switch v-model="friendPageSetting.friendIsComment" />
            </el-form-item>
            <!-- markdown编辑区 -->
            <el-form-item label="友链页面介绍">
              <mavon-editor :autofocus="false" :boxShadow="false" v-model="friendPageSetting.friendContent"/>
            </el-form-item>
          </el-main>
        </el-container>
      </el-row>
    </el-form>

    <!-- 新增/修改对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" :lock-scroll="false">

      <!-- 名称输入表单 -->
      <el-form label-position="top" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称">
              <el-input v-model="form.nickname" prefix-icon="el-icon-user" placeholder="输入昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像URL">
              <el-input v-model="form.avatar" prefix-icon="el-icon-camera" placeholder="输入头像URL"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一句话">
              <el-input v-model="form.description" prefix-icon="el-icon-chat-dot-square" placeholder="输入个签"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网站">
              <el-input v-model="form.website" prefix-icon="el-icon-bank-card" placeholder="输入个人主页"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button @click="submit" type="primary" >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {Notification} from "element-ui";
import {
  getFriendTable,
  saveFriend,
  updateFriend,
  deleteFriend,
  getFriendSetting,
  updateFriendSetting
} from "@/api/Friend";

export default {
  name: "FriendManage",

  data() {
    return {
      friendTable: [],
      totalPage: 0,
      total: 0,
      queryParam: {
        keyword: null,
        pageNo: 1,
        pageSize: 10,
        isPublished: null,
        time: null
      },
      friendPageSetting: {
        friendIsComment: false,
        friendContent: null
      },
      saveFlag: null,
      dialogTitle: null,
      dialog: false,
      form: {
        id: null,
        nickname: null,
        description: null,
        avatar: null,
        website: null,
      }
    }
  },

  watch: {
    //监听对话框关闭
    dialog: function (value) {
      if (!value) {
        this.saveFlag = 0;
        this.form.id = null;
        this.form.nickname = null;
        this.form.description = null;
        this.form.avatar = null;
        this.form.website = null;
      }
    }
  },

  created() {
    this.getTableData(true);
    this.getPageSetting();
  },

  methods: {
    //获取友链表格
    getTableData(clearPageNo) {
      //重置到第一页
      if (clearPageNo != null && clearPageNo) {
        this.queryParam.pageNo = 1;
      }
      //处理时间筛选，将对象转为数组
      let time = null;
      time = this.queryParam.time;
      if (time != null) {
        let arr = time.toString().split(",");
        this.queryParam.startTime = arr[0];
        this.queryParam.endTime = arr[1];
      } else {
        this.queryParam.startTime = null;
        this.queryParam.endTime = null;
      }
      getFriendTable(this.queryParam).then(res => {
        if (res.success) {
          this.friendTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //获取友链页面配置
    getPageSetting() {
      getFriendSetting().then(res => {
        if (res.success) {
          this.friendPageSetting.friendIsComment = res.data.friendIsComment === "true";
          this.friendPageSetting.friendContent = res.data.friendContent;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //更新友链页面配置
    updatePageSetting() {
      updateFriendSetting(this.friendPageSetting).then(res => {
        if (res.success) {
          Notification({
            title: '更新成功',
            type: 'success',
            duration: 1500
          })
          getFriendSetting();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    handleSizeChange(newSize) {
      this.queryParam.pageSize = newSize
      this.getTableData()
    },
    handleCurrentChange(newPage) {
      this.queryParam.pageNo = newPage
      this.getTableData()
    },
    addFriend() {
      this.dialogTitle = "新增友链";
      this.saveFlag = 1;
      this.dialog = true;
      this.form.id = null;
      this.form.nickname = null;
      this.form.description = null;
      this.form.avatar = null;
      this.form.website = null;
    },
    changeFriend(row) {
      this.dialogTitle = "更新友链";
      this.saveFlag = 2;
      this.dialog = true;
      this.form.id = row.id;
      this.form.nickname = row.nickname;
      this.form.description = row.description;
      this.form.avatar = row.avatar;
      this.form.website = row.website;
    },
    submit() {
      if (this.saveFlag === 1) {
        saveFriend(this.form).then(res => {
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
        this.updateFriendAtt(false);
      }
    },
    updateFriendAtt(isRow) {
      let data = {};
      if (isRow) {
        data.id = isRow.id;
        data.isPublished = isRow.isPublished;
      } else {
        data = this.form
      }
      updateFriend(data).then(res => {
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
    },
    removeFriend(row) {
      deleteFriend(row).then(res => {
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
}

.el-icon-edit-outline, .el-icon-view {
  font-size: 1.2rem;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}

.el-icon-edit-outline:hover, .el-icon-view:hover {
  color: #66ccff;
}

.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
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
