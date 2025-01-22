<template>
  <div>
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索任务名 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="搜索任务名称"
                      prefix-icon="el-icon-search"/>
          </div>
          <!-- 筛选任务类型 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.type" @input="getTableData(true)" placeholder="筛选任务类型" clearable>
              <el-option label="Bean" value="0"/>
              <el-option label="SQL" value="1"/>
              <el-option label="Shell" value="2"/>
            </el-select>
          </div>
          <!-- 筛选状态 -->
          <div>
            <el-select v-model="queryParam.status" @input="getTableData(true)" placeholder="筛选状态" clearable>
              <el-option label="停止" value="0"/>
              <el-option label="启用" value="1"/>
            </el-select>
          </div>
        </el-header>
      </el-container>
    </el-row>
    <el-row class="base_margin_b">
      <el-container>
        <el-header style="border-bottom: 2px solid rgb(241, 242, 243);">
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            定时任务
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <el-button @click="addTask" icon="el-icon-circle-plus-outline" size="medium" type="primary">新增任务</el-button>
            <el-button @click="getTableData(false)" size="medium" plain type="info"
                       class="base_refresh_btn base_margin_l_small"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 任务表格 -->
          <el-table :data="taskTable" class="base_margin_b_large">
            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="任务名称" prop="name" align="center" width="180" show-overflow-tooltip/>
            <el-table-column label="任务描述" prop="description" align="center" show-overflow-tooltip/>
            <el-table-column label="CRON表达式" prop="cron" align="center" width="120"/>
            <el-table-column label="状态" align="center" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status===1" size="small" effect="dark" type="success">启用</el-tag>
                <el-tag v-else size="small" effect="dark" type="info">停止</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="已执行" prop="currentCount" align="center" width="100"/>
            <el-table-column label="最多执行" prop="maxCount" align="center" width="120"/>
            <el-table-column label="下次执行" prop="nextTime" align="center" width="160"/>
            <el-table-column label="更新时间" prop="updateTime" align="center" width="160"/>
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.status===1" effect="dark" content="停止" placement="top">
                  <i @click="changeTaskStatus(scope.row)">
                    <BsFillStopFill class="base_icon base_text_point" size="18"/>
                  </i>
                </el-tooltip>
                <el-tooltip v-else effect="dark" content="启动" placement="top">
                  <i @click="changeTaskStatus(scope.row)">
                    <BsCaretRightFill class="base_icon base_text_point" size="18"/>
                  </i>
                </el-tooltip>
                <el-tooltip effect="dark" content="立即执行" placement="top">
                  <i @click="runNow(scope.row)">
                    <BsLightning class="base_icon base_text_point base_margin_l" size="18"/>
                    <!--                  <i class="el-icon-edit-outline base_text_point base_margin_l" @click=""/>-->
                  </i>
                </el-tooltip>
                <el-tooltip effect="dark" content="配置" placement="top">
                  <i @click="settingTask(scope.row)">
                    <BsNut class="base_icon base_text_point base_margin_lr" size="18" @click="settingTask(scope.row)"/>
                    <!--                  <i class="el-icon-edit-outline base_text_point base_margin_lr" @click=""/>-->
                  </i>
                </el-tooltip>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeTask(scope.row)">
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
    <!-- 新增/修改对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" :lock-scroll="false">
      <!-- 名称输入表单 -->
      <el-form label-position="left" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务名称">
              <el-input v-model="form.name" prefix-icon="el-icon-s-marketing" placeholder="输入任务名称"/>
            </el-form-item>
            <el-form-item label="任务类型">
              <el-select v-model="form.type" style="width: 100%" placeholder="选择任务类型">
                <el-option label="Bean" :value="0"/>
                <el-option label="SQL" :value="1"/>
                <el-option label="Shell" :value="2"/>
              </el-select>
            </el-form-item>
            <el-form-item label="CRON">
              <el-input v-model="form.cron" prefix-icon="el-icon-alarm-clock" placeholder="输入CRON表达式"/>
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="输入任务描述"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最多执行">
              <el-input v-model="form.maxCount" prefix-icon="el-icon-c-scale-to-original"
                        placeholder="输入最大执行次数，不填则无限次"/>
            </el-form-item>
            <el-form-item label="截止时间">
              <el-date-picker v-model="form.expireTime" style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss"
                              type="datetime"
                              placeholder="截止时间，不填则永久有效"/>
            </el-form-item>
            <el-form-item label="输入参数">
              <el-input v-model="form.param" prefix-icon="el-icon-coffee-cup" placeholder="任务的输入参数"/>
            </el-form-item>
            <el-form-item label="执行内容">
              <el-input v-model="form.content" type="textarea" :rows="4" placeholder="要执行的目标，Bean名称、SQL语句或Shell脚本"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button @click="submit" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {BsCaretRightFill, BsFillStopFill, BsLightning, BsNut} from "vue-icons-plus/icons/bs"
import {getTaskTable, createTask, exec, updateTaskStatus, deleteTask} from "@/api/Job";
import {Notification} from "element-ui";

export default {
  name: "JobManage",
  data() {
    return {
      totalPage: 0,
      total: 0,
      taskTable: [],
      queryParam: {
        type: null,
        status: null,
        keyword: null,
        pageNo: 1,
        pageSize: 10
      },
      saveFlag: null,
      dialogTitle: null,
      dialog: false,
      form: {
        id: null,
        name: null,
        type: null,
        cron: null,
        param: null,
        content: null,
        description: null,
        maxCount: null,
        expireTime: null
      }
    }
  },
  watch: {
    //监听对话框关闭
    dialog: function (value) {
      if (!value) {
        this.saveFlag = 0;
        this.form.id = null;
        this.form.name = null;
        this.form.type = null;
        this.form.cron = null;
        this.form.param = null;
        this.form.content = null;
        this.form.description = null;
        this.form.maxCount = null;
        this.form.expireTime = null;
      }
    }
  },
  created() {
    this.getTableData(true);
  },
  methods: {
    //获取任务列表
    getTableData(clearPageNo) {
      //重置到第一页
      if (clearPageNo != null && clearPageNo) {
        this.queryParam.pageNo = 1;
      }
      getTaskTable(this.queryParam).then(res => {
        if (res.success) {
          this.taskTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //新增任务
    addTask() {
      this.dialogTitle = "新增任务";
      this.saveFlag = 1;
      this.dialog = true;
      this.form.id = null;
      this.form.name = null;
      this.form.type = null;
      this.form.cron = null;
      this.form.param = null;
      this.form.content = null;
      this.form.description = null;
      this.form.maxCount = null;
      this.form.expireTime = null;
    },
    //配置任务
    settingTask(row) {
      this.dialogTitle = "配置任务";
      this.saveFlag = 2;
      this.dialog = true;
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.param = row.param;
      this.form.content = row.content;
      this.form.description = row.description;
      this.form.cron = row.cron;
      this.form.expireTime = row.expireTime;
      this.form.maxCount = row.maxCount;
      this.form.type = row.type;
    },
    //保存
    submit() {
      if (this.saveFlag === 1) {
        createTask(this.form).then(res => {
          if (res.success) {
            Notification({
              title: '创建任务成功',
              type: 'success',
              duration: 1500
            })
            //刷新表单,关闭对话框
            this.getTableData();
            this.dialog = false;
          } else {
            Notification({
              title: '创建任务失败',
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
      if (this.saveFlag === 2) {

      }
    },
    //立即执行
    runNow(row) {
      exec(row).then(res => {
        if (res.success) {
          Notification({
            title: '执行成功',
            type: 'success',
            duration: 1500
          })
          //删除成功刷新表格
          this.getTableData();
        } else {
          Notification({
            title: '执行失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //删除任务
    removeTask(row) {
      deleteTask(row).then(res => {
        if (res.success) {
          Notification({
            title: '删除任务成功',
            type: 'success',
            duration: 1500
          })
          //删除成功刷新表格
          this.getTableData();
        } else {
          Notification({
            title: '删除任务失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //启动停止任务
    changeTaskStatus(row) {
      updateTaskStatus(row).then(res => {
        if (res.success) {
          Notification({
            title: '成功',
            type: 'success',
            duration: 1500
          })
          //删除成功刷新表格
          this.getTableData();
        } else {
          Notification({
            title: '失败',
            message: res.msg,
            type: 'error'
          })
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
  },
  components: {
    BsFillStopFill,
    BsCaretRightFill,
    BsLightning,
    BsNut
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

.base_icon {
  position: relative;
  top: 2px;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}

.base_icon:hover {
  color: #66ccff;
}

.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}
</style>