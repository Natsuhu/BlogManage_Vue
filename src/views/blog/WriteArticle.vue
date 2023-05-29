<template>
	<el-card>
		<el-form :model="form" :rules="formRules" ref="formRef" label-position="top">
			<el-row :gutter="20">
				<!-- 文章标题 -->
				<el-col :span="12">
					<el-form-item label="文章标题" prop="title">
						<el-input v-model="form.title" placeholder="输入标题"></el-input>
					</el-form-item>
				</el-col>
				
				<!-- 封面图片 -->
				<el-col :span="12">
					<el-form-item label="文章首图" prop="thumbnail">
						<el-input v-model="form.thumbnail" placeholder="输入图片URL">
							<el-button slot="append">点击预览</el-button>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<!-- 文章描述 -->
			<el-form-item label="文章描述" prop="description">
				<mavon-editor v-model="form.description" />
			</el-form-item>
			
			<!-- 正文 -->
			<el-form-item label="文章正文" prop="content">
				<mavon-editor v-model="form.content" />
			</el-form-item>
			
			<el-row :gutter="20">
				<!-- 分类 -->
				<el-col :span="8">
					<el-form-item label="分类" prop="categoryId">
						<el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%;">
							<el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				
				<!-- 标签 -->
				<el-col :span="8">
					<el-form-item label="标签" prop="tags"> 
						<el-select v-model="form.tagIds" placeholder="选择标签" :multiple="true" style="width: 100%;">
							<el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				
				<!-- 属性 -->
				<el-col :span="8">
					<el-form-item label="权限">
						<div class="base_attr_box">
							<el-checkbox border v-model="form.isPublished" true-label="true" false-label="false">公开</el-checkbox>
							<el-checkbox border v-model="form.isCommentEnabled" true-label="true" false-label="false">评论</el-checkbox>
							<el-checkbox border v-model="form.isTop" true-label="true" false-label="false">置顶</el-checkbox>
							<el-checkbox border v-model="form.isRecommend" true-label="true" false-label="false">推荐</el-checkbox>
							<el-checkbox border v-model="form.isAppreciation" true-label="true" false-label="false">赞赏</el-checkbox>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row :gutter="20">
				<!-- 字数 -->
				<el-col :span="8">
					<el-form-item label="字数" prop="words">
						<el-input v-model="form.words" placeholder="输入文章字数" type="number"></el-input>
					</el-form-item>
				</el-col>
				
				<!-- 阅读时长 -->
				<el-col :span="8">
					<el-form-item label="阅读时长" prop="readTime">
						<el-input v-model="form.readTime" placeholder="输入阅读时长(分钟)" type="number"></el-input>
					</el-form-item>
				</el-col>
				
				<!-- 浏览次数 -->
				<el-col :span="8">
					<el-form-item label="浏览次数" prop="views">
						<el-input v-model="form.views" placeholder="输入文章字数,默认为0" type="number"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<!-- 提交表单 -->
			<el-form-item style="text-align: right;">
				<el-button type="primary" @click="submit">{{ buttonText }}</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	import { Notification } from "element-ui";
	import { saveArticle , getArticleById , updateArticle } from '@/api/Article';
	import { getCategories } from '@/api/Category';
	import { getTags } from '@/api/Tag';
	
	export default {
		name: "WriteArticle",
		
		data() {
			return {
				articleId: null,
				buttonText: null,
				categories: [],
				tags: [],
				form: {
					title: '',
					thumbnail: '',
					description: '',
					content: '',
					categoryId: null,
					tagIds: [],
					words: null,
					readTime: null,
					views: 0,
					isPublished: true,
					isCommentEnabled: true,
					isTop: false,
					isRecommend: false,
					isAppreciation: false
				},
				formRules: {
					title: [{required: true, message: '请输入标题', trigger: 'change'}],
					thumbnail: [{required: true, message: '请输入首图链接', trigger: 'change'}],
					categoryId: [{required: true, message: '请选择分类', trigger: 'change'}],
					words: [{required: true, message: '请输入文章字数', trigger: 'change'}]
				}
			}
		},
		
		created() {
			//判断是更新文章还是新增文章
			if (this.$route.params.id != null) {
				this.articleId = this.$route.params.id
			}
			//获取分类和标签
			this.getCateAndTag();
			//更新按钮文本
			if(this.articleId != null) {
				this.buttonText = '更新';
				this.getArticle(this.articleId);
			} else {
				this.buttonText = '保存';
			}
		},
		
		watch: {
			'form.words'(newValue) {
				this.form.readTime = newValue ? Math.round(newValue / 200) : null
			},
			//路由参数改为：在created中获取一次，无需动态监听
			// $route: {
			// 	handler() {
			// 		this.articleId = this.$route.params.id;
			// 	},
			// 	//在created前就能监听到变化
			// 	immediate: true,
			// 	//深度监听，同时也可监听到param参数变化
			// 	deep: true,
			// }

			//监听articleId变化改变按钮的文本
			'articleId'(newValue) {
				if (newValue != null) {
					this.buttonText = '更新';
				}else {
					this.buttonText = "保存";
				}
			}
		},
		
		methods: {
			//通过ID获取文章
			getArticle(id) {
				getArticleById(id).then(res => {
					if(res.success){
						this.form.title = res.data.title;
						this.form.thumbnail = res.data.thumbnail;
						this.form.description = res.data.description;
						this.form.content = res.data.content;
						this.form.categoryId = res.data.categoryId;
						this.form.isPublished = res.data.isPublished;
						this.form.isCommentEnabled = res.data.isCommentEnabled;
						this.form.tagIds = res.data.tagIds;
						this.form.isTop = res.data.isTop;
						this.form.isRecommend = res.data.isRecommend;
						this.form.isAppreciation = res.data.isAppreciation;
						this.form.words = res.data.words;
						this.form.views = res.data.views;
					}else {
						this.$message.error(res.msg);
					}
				})
			},
			//获取分类和标签
			getCateAndTag() {
				getCategories().then(res => {
					if(res.success){
						this.categories = res.data;
					}else {
						this.$message.error(res.msg);
					}
				}),
				getTags().then(res => {
					if(res.success){
						this.tags = this.tags.concat(res.data);
					}else {
						this.$message.error(res.msg);
					}
				})
			},
			//保存文章
			submit() {
				this.$refs.formRef.validate(valid => {
					if (valid) {
						//判断文章ID存在，存在就更新，否则新增
						if (this.articleId != null) {
							this.form.id = this.articleId;
							updateArticle(this.form).then(res => {
								if (res.success) {
									//更新成功清空表单并回到新增状态
									this.$refs.formRef.resetFields();
									this.articleId = null;
									//重置属性值和标签选择框
									this.form.tagIds = [];
									this.form.isPublished = true;
									this.form.isCommentEnabled = true;
									this.form.isTop = false;
									this.form.isRecommend = false;
									this.form.isAppreciation = false
									//回到页面最上面
									window.scrollTo({
										top: 0,
										behavior: 'smooth'
									});
									//弹窗提示
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
						} else {
							//文章ID不存在，新增文章
							saveArticle(this.form).then(res => {
								if (res.success) {
									//保存成功清空表单
									this.$refs.formRef.resetFields();
									//重置属性和标签选择框
									this.form.tagIds = [];
									this.form.isPublished = true;
									this.form.isCommentEnabled = true;
									this.form.isTop = false;
									this.form.isRecommend = false;
									this.form.isAppreciation = false
									//回到页面最上面
									window.scrollTo({
										top: 0,
										behavior: 'smooth'
									});
									//弹窗提示
									Notification({
										title: '保存成功',
										type: 'success'
									})
								} else {
									Notification({
										title: '保存失败',
										message: res.msg,
										type: 'error'
									})
								}
							})
						}
					} else {
						return this.msgError('请填写必要的表单项')
					}
				})
			}
		}
	}
</script>

<style scoped>
	.base_attr_box {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.el-checkbox {
		margin-left: 0px !important;
		margin-right: 0px !important;
	}

	/* 设置markdown编辑区域的图层，避免其覆盖header */
	.v-note-wrapper {
		z-index: 9 !important;
	}
</style>