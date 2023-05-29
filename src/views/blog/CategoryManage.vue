<template>
    <el-card>
		<!-- 操作面板 -->
		<el-row :gutter="24" class="base_margin_tb">

            <!-- 新增按钮 -->
            <el-col style="width: 100px">
                <el-button @click="addCategory()" type="primary" icon="el-icon-plus">新增</el-button>
            </el-col>

			<!-- 搜索名称 -->
			<el-col :span="5">
				<el-input v-model="queryParam.keyword" @input="getTableData()" clearable placeholder="搜索分类名称..." style="width: 100%;" prefix-icon="el-icon-search"/>
			</el-col>
		</el-row>

		<!-- 分类表格 -->
		<el-table :data="categoryTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">

        <!-- 固定列 -->
        <el-table-column label="序号" type="index" width="50" align="center"/>
        <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip/>
        <el-table-column label="文章数量" prop="articleCount" width="270" align="center"/>
        <el-table-column label="创建时间" prop="createTime" width="270" align="center"/>
        <el-table-column label="更新时间" prop="updateTime" width="270" align="center"/>

        <!-- 操作按钮 -->
        <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
            <!-- <i class="el-icon-edit"/>
            <i class="el-icon-delete"/> -->
                <el-button class="base_margin_r" type="primary" plain circle @click="changeCategory(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeCategory(scope.row)">
                    <el-button slot="reference" type="danger" plain circle icon="el-icon-delete" size="mini"></el-button>
                </el-popconfirm>
            </template>
        </el-table-column>
        </el-table>

        <!-- 新增/修改对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialog" modal="false" modal-append-to-body="false">

            <!-- 名称输入表单 -->
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="输入分类名称"></el-input>
                </el-form-item>
            </el-form>

            <!-- 操作按钮 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </div>
        </el-dialog>

        <!--分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParam.pageNo"
                :page-sizes="[10, 20, 30]" :page-size="queryParam.pageSize" :page-count="totalPage" :total="total"
                layout="total, sizes, prev, pager, next, jumper" background style="float: right;" class="base_margin_b">
        </el-pagination>
    </el-card>
</template>

<script>
	import { Notification } from "element-ui";
    import { getCategoryTable , saveCategory , updateCategory , deleteCategory } from "@/api/Category"

    export default {
        name: "CategoryManage",

        data() {
            return {
                visible: false,
                //保存标记，1新增2更新
                saveFlag: 0,
                //对话框标题：新增或更新
                dialogTitle: null,
                //对话框激活标记
                dialog: false,
                categoryTable: [],
                totalPage: 0,
				total: 0,
                queryParam: {
                    keyword: null,
					pageNo: 1,
					pageSize: 10
                },
                //更新&新增提交表单
                form: {
                    id: null,
                    name: null
                }
            }
        },

        watch: {
            //监听对话框关闭
            dialog: function(value) {
                if (!value) {
                    this.saveFlag = 0;
                    this.form.id = null;
                    this.form.name = null;
                }
            }
        },

        created() {
            this.getTableData()
        },

        methods: {
            //获取分类表格
			getTableData() {
				getCategoryTable(this.queryParam).then(res => {
					if(res.success){
						this.categoryTable = res.data;
						this.totalPage = res.totalPage;
						this.total = res.total;
					}else {
						this.$message.error(res.msg);
					}
				})
			},
            //新增分类按钮
            addCategory() {
                this.saveFlag = 1;
                this.dialog = true;
                this.dialogTitle = "新增分类";
                this.form.id = null;
                this.form.name = null;
            },
            //表格编辑分类按钮
            changeCategory(row) {
                this.saveFlag = 2;
                this.dialog = true;
                this.dialogTitle = "编辑分类";
                this.form.id = row.id;
                this.form.name = row.name;
            },
            //对话框确定按钮
            submit() {
                if (this.saveFlag === 1) {
                    saveCategory(this.form).then(res => {
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
                    updateCategory(this.form).then(res =>{
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
                }
            },
            //表格删除按钮
            removeCategory(row) {
                deleteCategory(row).then(res => {
                    if(res.success){
                        Notification({
							title: '删除成功',
							type: 'success',
							duration: 1500
						})
                        //删除成功刷新表格
                        this.getTableData();
					}else {
						Notification({
							title: '删除失败',
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

<style>

</style>