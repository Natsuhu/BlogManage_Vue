<template>
  <div>
    <!-- 筛选面板 -->
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 时间范围 -->
          <div class="base_margin_r">
            <el-date-picker type="daterange" v-model="queryParam.time" @input="getTableData(true)" range-separator="至"
                            start-placeholder="最后访问时间开始"
                            value-format="yyyy-MM-dd" clearable end-placeholder="最后访问时间结束" placeholder="选择时间范围"/>
          </div>
        </el-header>
      </el-container>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-container>
        <el-header>
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            访客统计
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <!-- 新增按钮 -->
            <el-button @click="getTableData(false)" size="medium" plain type="info" class="base_refresh_btn"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 访问记录 -->
          <el-table :data="visitorTable" class="base_margin_b_large">
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="访客标识" prop="id" align="center" show-overflow-tooltip/>
            <el-table-column label="IP地址" prop="ip" align="center" show-overflow-tooltip/>
            <el-table-column label="IP归属" prop="ipSource" align="center" show-overflow-tooltip/>
            <el-table-column label="操作系统" prop="os" align="center" show-overflow-tooltip/>
            <el-table-column label="浏览器" prop="browser" align="center" show-overflow-tooltip/>
            <el-table-column label="访问次数" prop="pv" align="center" show-overflow-tooltip/>
            <el-table-column label="首次访问" prop="createTime" align="center" show-overflow-tooltip/>
            <el-table-column label="最后访问" prop="lastTime" align="center" show-overflow-tooltip/>
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="查看访问记录" placement="top">
                  <i class="el-icon-view base_text_point base_margin_r" @click=""/>
                </el-tooltip>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="">
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
  </div>
</template>

<script>
import {Notification} from "element-ui";
import { getVisitorTable } from "@/api/Visitor";

export default {
  name: "VisitorStatistics",
  data() {
    return {
      visitorTable: [],
      totalPage: 0,
      total: 0,
      queryParam: {
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
      getVisitorTable(this.queryParam).then( res=> {
        if (res.success) {
          this.visitorTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
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

.el-icon-view {
  font-size: 1.2rem;
  font-weight: 100;
  color: #606266;
  transition: color .15s linear;
}

.el-icon-view:hover {
  color: #66ccff;
}

.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}
</style>