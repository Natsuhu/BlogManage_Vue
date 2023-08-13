<template>
  <div>
    <!--  筛选面板  -->
    <el-row>
      <el-container>
        <el-header>
          <!-- 搜索内容 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData()" clearable placeholder="昵称\评论内容" prefix-icon="el-icon-search"/>
          </div>

          <!-- 选择页面 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.page" @input="getTableData()" clearable placeholder="页面">
              <el-option :label="'友链'" :value="2" />
              <el-option :label="'关于我'" :value="3" />
            </el-select>
          </div>

          <!-- 选择文章 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.articleId" @input="getTableData()" clearable placeholder="文章">
              <el-option v-for="item in articles" :key="item.index" :label="item.title" :value="item.id" />
            </el-select>
          </div>

          <!-- 时间范围 -->
          <div class="base_margin_r">
            <el-date-picker type="daterange" v-model="queryParam.time" @input="getTableData()" range-separator="至" start-placeholder="开始时间"
                            value-format="yyyy-MM-dd" clearable end-placeholder="结束时间" placeholder="选择时间范围" />
          </div>
        </el-header>
      </el-container>
    </el-row>

    <!--  表格  -->
    <el-row>
      <el-container>
        <el-main>
          <el-table :data="commentTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">
            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="头像" align="center">
              <template slot-scope="scope">
                <el-avatar shape="square" size="medium" :src="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="昵称" width="100" prop="nickname"  align="center" show-overflow-tooltip/>
            <el-table-column label="内容" prop="content" align="center" show-overflow-tooltip/>
            <el-table-column label="页面" width="150" prop="pageName" align="center" show-overflow-tooltip/>
            <el-table-column label="公开" width="150" align="center">
              <template slot-scope="scope">
								<el-switch v-model="scope.row.isPublished" @change="updateCommentAtt(scope.row)" />
							</template>
            </el-table-column>
            <el-table-column label="城市" prop="city" align="center"/>
            <el-table-column label="邮箱" prop="email" align="center" show-overflow-tooltip/>
            <el-table-column label="主页" prop="website" align="center" show-overflow-tooltip/>
            <el-table-column label="QQ" prop="qq" align="center" show-overflow-tooltip/>
            <el-table-column label="评论时间" prop="createTime" align="center" show-overflow-tooltip/>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                  <el-button class="base_margin_r" type="primary" plain circle @click="changeTag(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                  <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                              title="这可是物理删除！" @onConfirm="">
                      <el-button slot="reference" type="danger" plain circle icon="el-icon-delete" size="mini"></el-button>
                  </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParam.pageNo"
                         :page-sizes="[10, 20, 30, 50, 100]" :page-size="queryParam.pageSize" :page-count="totalPage" :total="total"
                         layout="total, sizes, prev, pager, next, jumper" background style="float: right;" class="base_margin_b">
          </el-pagination>
        </el-main>
      </el-container>
    </el-row>
  </div>
</template>

<script>
  import { Notification } from "element-ui";
  import { getCategories } from '@/api/Category';
  import { getCommentTable, updateComment,  getArticleSelector} from "@/api/Comment";

  export default {
    name: "CommentManage",

    data() {
      return {
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
        }
      }
    },

    created() {
      this.articleSelector()
      this.getTableData()
    },

    methods: {
      //获取文章表格
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
        getCommentTable(this.queryParam).then(res => {
          if(res.success){
            this.commentTable = res.data;
            this.totalPage = res.totalPage;
            this.total = res.total;
          }else {
            this.$message.error(res.msg);
          }
        })
      },
      updateCommentAtt(updateParam) {
        let attrList = {};
        attrList.id = updateParam.id;
        attrList.isPublished = updateParam.isPublished;
        attrList.content = updateParam.content;
        updateComment(attrList).then(res => {
          if (res.success) {
            this.getTableData();
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
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .el-header {
    display: flex;
    align-items: center;
  }
</style>
