<template>
  <div>
    <!-- 筛选面板 -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索操作人 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="搜索操作者"
                      prefix-icon="el-icon-search"/>
          </div>
          <!-- 选择类型 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.type" @input="getTableData(true)" clearable placeholder="筛选类型">
              <el-option label="登录" value="1"/>
              <el-option label="新增" value="2"/>
              <el-option label="更新" value="3"/>
              <el-option label="删除" value="4"/>
              <el-option label="查询" value="5"/>
              <el-option label="上传" value="6"/>
              <el-option label="下载" value="7"/>
              <el-option label="执行" value="8"/>
            </el-select>
          </div>
          <!-- 选择状态 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.status" @input="getTableData(true)" clearable placeholder="筛选状态">
              <el-option label="成功" value="1"/>
              <el-option label="失败" value="0"/>
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
    <!-- 表格 -->
    <el-row>
      <el-container>
        <el-header>
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            操作记录
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <!-- 新增按钮 -->
            <el-button @click="add()" size="medium" type="primary">新增</el-button>
            <el-button @click="getTableData(false)" size="medium" plain type="info" class="base_refresh_btn"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 访问记录 -->
          <el-table :data="operationLogTable" class="base_margin_b_large">
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="用户" prop="username" align="center" show-overflow-tooltip/>
            <el-table-column label="操作类型" prop="typeString" width="100" align="center" show-overflow-tooltip/>
            <el-table-column label="操作描述" prop="description" align="center" show-overflow-tooltip/>
            <el-table-column label="状态" align="center" width="70">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.statusString === '成功'" size="small">{{ scope.row.statusString }}</el-tag>
                <el-tag v-else size="small" effect="dark" type="danger">{{ scope.row.statusString }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时" align="center" width="80">
              <template slot-scope="scope">
                <el-tag size="small">{{ scope.row.times }}ms</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="IP地址" prop="ip" align="center" show-overflow-tooltip/>
            <el-table-column label="IP归属" prop="ipSource" align="center" show-overflow-tooltip/>
            <el-table-column label="操作系统" prop="os" align="center" show-overflow-tooltip/>
            <el-table-column label="浏览器" prop="browser" align="center" show-overflow-tooltip/>
            <el-table-column label="操作时间" prop="createTime" align="center" show-overflow-tooltip/>
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeOperationLog(scope.row)">
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

    <!-- 对话框 -->
    <el-dialog title="厉不厉害你坤哥？" :visible.sync="dialog" :lock-scroll="false">
      <!-- 内容 -->
      <span>你干嘛~~哈哈~~哎哟~~</span>
      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="dialog = false">唱</el-button>
        <el-button type="success" plain @click="dialog = false">跳</el-button>
        <el-button type="info" plain @click="dialog = false">RAP</el-button>
        <el-button type="warning" plain @click="dialog = false">篮球</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {Notification} from "element-ui";
import { getOperationLogTable, deleteOperationLog } from "@/api/OperationLog";

export default {
  name: "OperationLog",
  data() {
    return {
      operationLogTable: [],
      totalPage: 0,
      total: 0,
      dialog: false,
      queryParam: {
        keyword: null,
        type: null,
        status: null,
        time: null,
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    //获取访客记录表格
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
        this.queryParam.startTime = arr[0] + " 00:00:00";
        this.queryParam.endTime = arr[1] + " 23:59:59";
      } else {
        this.queryParam.startTime = null;
        this.queryParam.endTime = null;
      }
      getOperationLogTable(this.queryParam).then( res=> {
        if (res.success) {
          this.operationLogTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    removeOperationLog(row) {
      deleteOperationLog(row).then(res => {
        if (res.success) {
          Notification({
            title: '删除成功',
            type: 'success',
            duration: 1500
          })
          //删除成功刷新表格
          this.getTableData();
        } else {
          Notification({
            title: '删除失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //新增标签按钮
    add() {
      this.dialog = true;
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

.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}
</style>