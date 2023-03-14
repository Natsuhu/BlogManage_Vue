<template>
	<div>
		<!-- 筛选面板 -->
		<el-row class="base_margin_b">
			<el-col :span="8">
				<el-button>筛选预留</el-button>
			</el-col>
		</el-row>
		
		<!-- 文章表格 -->
		<el-table :data="articleTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">

			<!-- 固定列 -->
			<el-table-column label="序号" type="index" width="50" align="center"/>
			<el-table-column label="标题" prop="title" align="center" show-overflow-tooltip/>
			<el-table-column label="分类" prop="categoryName" width="150" align="center"/>
			<el-table-column label="浏览数" prop="views" width="100" align="center"/>
			<el-table-column label="字数" prop="words" width="100" align="center"/>

			<!-- 可快捷更新列 -->
			<el-table-column label="编辑属性" width="150" align="center">
				<template slot-scope="scope">
					<el-popover placement="bottom" width="220" :ref="`popover-${scope.$index}`">
						<el-row :gutter="20" class="base_margin_b">
							<el-col :span="12">
								<span class="base_margin_r">公开</span>
								<el-switch v-model="scope.row.isPublished" @change="updateArticleData(scope.row)"/>
							</el-col>
							<el-col :span="12">
								<span class="base_margin_r">置顶</span>
								<el-switch v-model="scope.row.isTop" @change="updateArticleData(scope.row)"/>
							</el-col>
						</el-row>
						<el-row :gutter="20" class="base_margin_b">
							<el-col :span="12">
								<span class="base_margin_r">评论</span>
								<el-switch v-model="scope.row.isCommentEnabled" @change="updateArticleData(scope.row)"/>
							</el-col>
							<el-col :span="12">
								<span class="base_margin_r">推荐</span>
								<el-switch v-model="scope.row.isRecommend" @change="updateArticleData(scope.row)"/>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<span class="base_margin_r">赞赏</span>
								<el-switch v-model="scope.row.isAppreciation" @change="updateArticleData(scope.row)"/>
							</el-col>
						</el-row>
						<el-link slot="reference" icon="el-icon-edit" :underline="false">{{ scope.row.isPublished ? "公开" : "私人" }}</el-link>
					</el-popover>
				</template>
			</el-table-column>
			
			<!-- 固定列 -->
			<el-table-column label="创建时间" prop="createTime" width="170" align="center"/>
			<el-table-column label="更新时间" prop="updateTime" width="170" align="center"/>

			<!-- 操作按钮 -->
			<el-table-column label="操作" width="150" align="center"> 
				<el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
			</el-table-column>
		</el-table>
		
		<!--分页-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParam.pageNo"
					   :page-sizes="[10, 20, 30, 50, 100]" :page-size="queryParam.pageSize" :page-count="totalPage" :total="total"
					   layout="total, sizes, prev, pager, next, jumper" background style="float: right;">
		</el-pagination>
	</div>
	
	
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import { Notification } from "element-ui";
	import { getArticleTable , updateArticle } from "@/api/Article";
	
	export default {
		name: "ArticleTable",
		
		data() {
			return {
				articleTable: [],
				totalPage: 0,
				total: 0,
				queryParam: {
					categoryId: null,
					isTop: null,
					isPublished: null,
					isRecommend: null,
					isAppreciation: null,
					isCommentEnabled: null,
					startTime: null,
					endTime: null,
					keyword: null,
					pageNo: 1,
					pageSize: 10,
				}
			}
		},
		
		created() {
			this.getTableData()
		},
		
		methods: {
			//获取文章表格
			getTableData() {
				getArticleTable(this.queryParam).then(res => {
					if(res.success){
						this.articleTable = res.data;
						this.totalPage = res.totalPage;
						this.total = res.total;
					}else {
						this.$message.error(res.msg);
					}
				})
			},
			//直接在表格内更新文章属性
			updateArticleData(updateParam) {
				let attrList = {};
				attrList.id = updateParam.id;
				attrList.isPublished = updateParam.isPublished;
				attrList.isTop = updateParam.isTop;
				attrList.isCommentEnabled = updateParam.isCommentEnabled;
				attrList.isRecommend = updateParam.isRecommend;
				attrList.isAppreciation = updateParam.isAppreciation;
				updateArticle(attrList).then(res => {
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
		},
		
		components: {
			Breadcrumb
		}
	}
</script>

<style>
	
</style>