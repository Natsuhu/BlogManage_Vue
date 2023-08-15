<template>
  <div>
    <!-- 筛选面板 -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索标题 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData()" clearable placeholder="搜索内容" prefix-icon="el-icon-search"/>
          </div>

          <!-- 时间范围 -->
          <div class="base_margin_r">
            <el-date-picker type="daterange" v-model="queryParam.time" @input="getTableData()" range-separator="至" start-placeholder="开始时间"
                            value-format="yyyy-MM-dd" clearable end-placeholder="结束时间" placeholder="选择时间范围" />
          </div>
        </el-header>
      </el-container>
    </el-row>

    <el-row>
      <el-container>
        <el-header>
          <div style="border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">动态管理</div>
        </el-header>
        <el-main>
          <!-- 动态表格 -->
          <el-table :data="momentTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">

            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="头像" prop="avatar" align="center"/>
            <el-table-column label="作者" prop="author" align="center"/>
            <el-table-column label="内容" prop="content" align="center" show-overflow-tooltip/>
            <el-table-column label="点赞数" prop="likes" align="center"/>
            <el-table-column label="权限" prop="isPublished" align="center">
              <template slot-scope="scope">
                <el-popover placement="bottom" width="220" :ref="`popover-${scope.$index}`">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <span class="base_margin_r">公开</span>
                      <el-switch v-model="scope.row.isPublished" @change="updateMomentAtt(scope.row)"/>
                    </el-col>
                    <el-col :span="12">
                      <span class="base_margin_r">评论</span>
                      <el-switch v-model="scope.row.isCommentEnabled" @change="updateMomentAtt(scope.row)"/>
                    </el-col>
                  </el-row>
                  <el-link slot="reference" icon="el-icon-edit" :underline="false">{{ scope.row.isPublished ? "公开" : "私人" }}</el-link>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" prop="publishTime" width="270" align="center"/>
            <el-table-column label="编辑时间" prop="editTime" width="270" align="center"/>

            <!-- 操作按钮 -->
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button class="base_margin_r" type="primary" plain circle @click="editMoment(scope.row.id)" icon="el-icon-edit" size="mini"></el-button>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeCategory(scope.row)">
                  <el-button slot="reference" type="danger" plain circle icon="el-icon-delete" size="mini"></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParam.pageNo"
                         :page-sizes="[10, 20, 30]" :page-size="queryParam.pageSize" :page-count="totalPage" :total="total"
                         layout="total, sizes, prev, pager, next, jumper" background style="float: right;" class="base_margin_b">
          </el-pagination>
        </el-main>
      </el-container>
    </el-row>
  </div>
</template>

<script>
  import { Notification } from "element-ui";
  import { getMomentTable, updateMoment } from "@/api/Moment";

  export default {
    name: "MomentManage",

    data() {
      return {
        momentTable: [],
        totalPage: 0,
        total: 0,
        queryParam: {
          time: null,
          keyword: null,
          pageNo: 1,
          pageSize: 10
        }
      }
    },

    created() {
      this.getTableData()
    },

    methods: {
      //获取动态表格
      getTableData() {
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
        getMomentTable(this.queryParam).then(res => {
          if (res.success) {
            this.momentTable = res.data;
            this.totalPage = res.totalPage;
            this.total = res.total;
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      //直接在表格内更新动态权限
      updateMomentAtt(updateParam) {
        let attrList = {};
        attrList.id = updateParam.id;
        attrList.isPublished = updateParam.isPublished;
        attrList.isCommentEnabled = updateParam.isCommentEnabled;
        updateMoment(attrList).then(res => {
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
      },
      //编辑按钮跳转，编辑动态
      editMoment(id) {
        this.$router.push({
          name: 'WriteMoment',
          params: {
            id
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
    border-bottom: 2px solid rgb(241, 242, 243);
  }
</style>
