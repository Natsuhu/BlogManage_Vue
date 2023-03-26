<template>
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
				<el-form-item label="属性">
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
			<el-button type="primary" @click="submit">保存</el-button>
		</el-form-item>
		
	</el-form>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import { Notification } from "element-ui";
	import { saveArticle } from '@/api/Article';
	import { getCategories } from '@/api/Category';
	import { getTags } from '@/api/Tag';
	
	export default {
		name: "WriteArticle",
		
		data() {
			return {
				categories: [],
				tags: [],
				radio: 1,
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
		
		watch: {
			'form.words'(newValue) {
				this.form.readTime = newValue ? Math.round(newValue / 200) : null
			},
		},
		
		methods: {
			submit() {
				this.$refs.formRef.validate(valid => {
					if (valid) {
						saveArticle(this.form).then(res => {
							if (res.success) {
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
					} else {
						return this.msgError('请填写必要的表单项')
					}
				})
			}
		},
		
		components: {
			Breadcrumb
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