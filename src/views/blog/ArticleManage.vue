<template>
	<div>
		<!-- 筛选面板 -->
		<el-row :gutter="24" class="base_margin_tb">
			<!-- 搜索标题 -->
			<el-col :span="3">
				<el-input v-model="queryParam.keyword" @input="getTableData()" clearable placeholder="搜索标题" style="width: 100%;" prefix-icon="el-icon-search"/>
			</el-col>
			
			<!-- 选择分类 -->
			<el-col :span="3">
				<el-select v-model="queryParam.categoryId" @input="getTableData()" clearable placeholder="筛选分类" style="width: 100%;">
					<el-option v-for="item in categories" :key="item.index" :label="item.name" :value="item.id" />
				</el-select>
			</el-col>
			
			<!-- 时间范围 -->
			<el-col :span="16">
				<el-date-picker type="daterange" v-model="queryParam.time" @input="getTableData()" range-separator="至" start-placeholder="开始时间"
								value-format="yyyy-MM-dd" clearable end-placeholder="结束时间" placeholder="选择时间范围" />
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
								<el-switch v-model="scope.row.isPublished" @change="updateArticleAtt(scope.row)"/>
							</el-col>
							<el-col :span="12">
								<span class="base_margin_r">置顶</span>
								<el-switch v-model="scope.row.isTop" @change="updateArticleAtt(scope.row)"/>
							</el-col>
						</el-row>
						<el-row :gutter="20" class="base_margin_b">
							<el-col :span="12">
								<span class="base_margin_r">评论</span>
								<el-switch v-model="scope.row.isCommentEnabled" @change="updateArticleAtt(scope.row)"/>
							</el-col>
							<el-col :span="12">
								<span class="base_margin_r">推荐</span>
								<el-switch v-model="scope.row.isRecommend" @change="updateArticleAtt(scope.row)"/>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<span class="base_margin_r">赞赏</span>
								<el-switch v-model="scope.row.isAppreciation" @change="updateArticleAtt(scope.row)"/>
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
				<template slot-scope="scope">
					<el-button circle type="primary" plain icon="el-icon-edit" size="mini" @click="editArticle(scope.row.id)"></el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!--分页-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryParam.pageNo"
					   :page-sizes="[10, 20, 30, 50, 100]" :page-size="queryParam.pageSize" :page-count="totalPage" :total="total"
					   layout="total, sizes, prev, pager, next, jumper" background style="float: right;">
		</el-pagination>
	</div>
	
	
</template>

<script>
	import { Notification } from "element-ui";
	import { getCategories } from '@/api/Category';
	import { getArticleTable , updateArticle } from "@/api/Article";
	
	export default {
		name: "ArticleManage",
		
		data() {
			return {
				categories: [],
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
					time: null,
					keyword: null,
					pageNo: 1,
					pageSize: 10
				}
			}
		},
		
		created() {
			this.getCategories()
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
			//获取分类，用于筛选
			getCategories() {
				getCategories().then(res => {
					if(res.success){
						this.categories = res.data;
					}else {
						this.$message.error(res.msg);
					}
				})
			},
			//直接在表格内更新文章属性
			updateArticleAtt(updateParam) {
				let attrList = {};
				attrList.id = updateParam.id;
				attrList.categoryId = updateParam.categoryId
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
			//编辑按钮跳转，编辑文章
			editArticle(id) {
				this.$router.push({
					name: 'WriteBlog',
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

<style>
	
</style>