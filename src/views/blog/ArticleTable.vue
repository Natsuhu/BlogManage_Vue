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
			<el-table-column label="序号" type="index" width="50" align="center"/>
			<el-table-column label="标题" prop="title" align="center" show-overflow-tooltip/>
			<el-table-column label="分类" prop="categoryName" width="150" align="center"/>
			<el-table-column label="浏览数" prop="views" width="100" align="center"/>
			<el-table-column label="字数" prop="words" width="100" align="center"/>
			<el-table-column label="编辑属性" width="100" align="center">
				<el-link icon="el-icon-edit" :underline="false">
					可见
				</el-link>
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime" width="170" align="center"/>
			<el-table-column label="更新时间" prop="updateTime" width="170" align="center"/>
			<el-table-column label="操作" width="150" align="center"> 
				<el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
			</el-table-column>
		</el-table>
		
		<!--分页-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParam.pageNo"
					   :page-sizes="[10, 20, 30, 50]" :page-size="queryParam.pageSize" :page-count="totalPage" :total="total"
					   layout="total, sizes, prev, pager, next, jumper" background style="float: right;">
		</el-pagination>
	</div>
	
	
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import { getArticleTable } from "@/api/Article"
	
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
			//分页
			handleSizeChange(newSize) {
				this.queryParam.pageSize = newSize
				this.getTableData()
			},
			//分页
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