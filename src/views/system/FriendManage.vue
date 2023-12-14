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
            <el-button size="medium" type="primary">新增</el-button>
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
                <el-switch v-model="scope.row.isPublished" @change="updateAnnexAtt(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" width="160"/>
            <el-table-column label="更新时间" prop="updateTime" align="center" width="160"/>

            <!-- 操作按钮 -->
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit-outline base_text_point base_margin_r" @click="changeAnnex(scope.row)"/>
                </el-tooltip>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeAnnex(scope.row)">
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
    <el-form :model="form" :rules="formRules" ref="formRef" label-position="top">
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

.el-icon-edit-outline {
  font-size: 1.2rem;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}

.el-icon-edit-outline:hover {
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
