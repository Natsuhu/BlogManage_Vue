<template>
  <div>
    <!--  筛选面板  -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索内容 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="昵称\评论内容"
                      prefix-icon="el-icon-search"/>
          </div>

          <!-- 选择页面 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.page" @input="getTableData(true)" clearable placeholder="页面">
              <el-option :label="'友链'" :value="2"/>
              <el-option :label="'关于我'" :value="3"/>
            </el-select>
          </div>

          <!-- 选择文章 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.articleId" @input="getTableData(true)" clearable placeholder="文章">
              <el-option v-for="item in articles" :key="item.index" :label="item.title" :value="item.id"/>
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

    <!--  表格  -->
    <el-row>
      <el-container>
        <el-header>
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            评论管理
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <el-button @click="getTableData(false)" size="medium" plain type="info" class="base_refresh_btn"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <el-table :data="commentTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">
            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="头像" align="center">
              <template slot-scope="scope">
                <el-avatar shape="square" size="medium" :src="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="昵称" width="100" prop="nickname" align="center" show-overflow-tooltip/>
            <el-table-column label="内容" prop="content" align="center" show-overflow-tooltip/>
            <el-table-column label="页面" width="150" prop="pageName" align="center" show-overflow-tooltip/>
            <el-table-column label="公开" width="150" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isPublished" @change="updateCommentAtt(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="城市" prop="city" align="center"/>
            <el-table-column label="邮箱" prop="email" align="center" show-overflow-tooltip/>
            <el-table-column label="主页" prop="website" align="center" show-overflow-tooltip/>
            <el-table-column label="QQ" prop="qq" align="center" show-overflow-tooltip/>
            <el-table-column label="评论时间" prop="createTime" align="center" show-overflow-tooltip/>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑评论" placement="top">
                  <i class="el-icon-edit-outline base_text_point base_margin_r" @click="changeComment(scope.row)"/>
                </el-tooltip>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="将会删除其所有子评论！" @onConfirm="removeComment(scope.row)">
                  <i slot="reference" class="el-icon-delete base_text_point"/>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="queryParam.pageNo"
                         :page-sizes="[10, 20, 30, 50, 100]" :page-size="queryParam.pageSize" :page-count="totalPage"
                         :total="total"
                         layout="total, sizes, prev, pager, next, jumper" background style="float: right;"
                         class="base_margin_b">
          </el-pagination>
        </el-main>
      </el-container>
    </el-row>

    <!-- 新增/修改对话框 -->
    <el-dialog title="编辑评论" :visible.sync="dialog" :lock-scroll="false">

      <!-- 名称输入表单 -->
      <el-form ref="updateForm" :model="updateForm" label-width="80px">
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="updateForm.qq" placeholder="输入QQ号"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email" placeholder="输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="主页" prop="website">
          <el-input v-model="updateForm.website" placeholder="输入主页"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input :rows="5" type="textarea" v-model="updateForm.content" placeholder="输入评论内容"></el-input>
        </el-form-item>

      </el-form>

      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="updateCommentAtt(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getCommentTable, updateComment, getArticleSelector, deleteComment} from "@/api/Comment";

export default {
  name: "CommentManage",

  data() {
    return {
      dialog: null,
      articles: [],
      commentTable: [],
      totalPage: 0,
      total: 0,
      queryParam: {
        keyword: null,
        pageNo: 1,
        pageSize: 10,
        time: null,
        page: null,
        articleId: null
      },
      updateForm: {
        id: null,
        qq: null,
        email: null,
        website: null,
        content: null
      }
    }
  },

  watch: {
    //监听对话框关闭
    dialog: function (value) {
      if (!value) {
        this.updateForm.id = null;
        this.updateForm.qq = null;
        this.updateForm.email = null;
        this.updateForm.website = null;
        this.updateForm.content = null;
      }
    }
  },

  created() {
    this.articleSelector()
    this.getTableData()
  },

  methods: {
    //获取评论表格
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
      getCommentTable(this.queryParam).then(res => {
        if (res.success) {
          this.commentTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //表格中的编辑按钮
    changeComment(row) {
      this.dialog = true;
      this.updateForm.id = row.id;
      this.updateForm.qq = row.qq;
      this.updateForm.email = row.email;
      this.updateForm.website = row.website;
      this.updateForm.content = row.content;
    },
    //更新评论
    updateCommentAtt(isRow) {
      let attrList = {};
      if (isRow) {
        attrList.id = isRow.id;
        attrList.isPublished = isRow.isPublished;
      } else {
        attrList = this.updateForm;
      }
      updateComment(attrList).then(res => {
        if (res.success) {
          this.getTableData();
          this.dialog = false;
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
    //删除评论
    removeComment(row) {
      deleteComment(row).then(res => {
        if (res.success) {
          this.getTableData();
          Notification({
            title: '删除成功',
            message: '共删除' + res.data + '条记录',
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
    //获取文章下拉框
    articleSelector() {
      getArticleSelector().then(res => {
        if (res.success) {
          this.articles = res.data;
        } else {
          Notification({
            title: '获取文章下拉框失败',
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

.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}
</style>
