<template>
  <div>
    <el-row class="base_margin_b">
      <el-container>
        <el-header height="80px">
          <!-- 搜索文件名 -->
          <div class="base_margin_r">
            <el-input v-model="queryParam.keyword" @input="getTableData(true)" clearable placeholder="搜索标题"
                      prefix-icon="el-icon-search"/>
          </div>

          <!-- 选择分后缀名 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.suffix" @input="getTableData(true)" clearable placeholder="筛选后缀名">
              <el-option v-for="item in suffixList" :key="item.index" :label="item" :value="item"/>
            </el-select>
          </div>

          <!-- 选择是否公开 -->
          <div class="base_margin_r">
            <el-select v-model="queryParam.isPublished" @input="getTableData(true)" clearable placeholder="筛选是否公开">
              <el-option label="公开" :value="true"/>
              <el-option label="私人" :value="false"/>
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

    <el-row>
      <el-container>
        <el-header>
          <div style="width: 50%; border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
            文件管理
          </div>
          <div style="width: 50%; display: flex; justify-content: flex-end">
            <!-- 上传按钮 -->
            <el-button size="medium" type="primary">上传</el-button>
            <el-button @click="getTableData(false)" size="medium" plain type="info"
                       class="base_refresh_btn base_margin_l_small"
                       icon="el-icon-refresh-right"/>
          </div>
        </el-header>
        <el-main>
          <!-- 文件表格 -->
          <el-table :data="annexTable" :header-cell-style="{background:'#f5f7fa'}" class="base_margin_b_large">

            <!-- 固定列 -->
            <el-table-column label="序号" type="index" width="50" align="center"/>
            <el-table-column label="文件名" prop="name" align="center" show-overflow-tooltip/>
            <el-table-column label="后缀名" prop="suffix" width="160" align="center"/>
            <el-table-column label="体积" prop="formatSize" width="160" align="center"/>
            <el-table-column label="公开" width="160" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isPublished" @change="updateAnnexAtt(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column label="上传时间" width="200" prop="createTime" align="center"/>

            <!-- 操作按钮 -->
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <!-- <i class="el-icon-edit"/>
                <i class="el-icon-delete"/> -->
                <el-button type="primary" plain circle @click="downloadAnnex(scope.row)"
                           icon="el-icon-download" size="mini"></el-button>
                <el-button class="base_margin_lr_small" type="primary" plain circle @click="changeAnnex(scope.row)"
                           icon="el-icon-edit" size="mini"></el-button>
                <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                               title="这可是物理删除！" @onConfirm="removeAnnex(scope.row)">
                  <el-button slot="reference" type="danger" plain circle icon="el-icon-delete" size="mini"></el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialog" model="false" model-append-to-body="false">

      <!-- 名称输入表单 -->
      <el-form ref="form" :model="updateForm" label-width="80px">
        <el-form-item label="文件名" prop="name">
          <el-input v-model="updateForm.name" placeholder="输入分类名称"></el-input>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAnnexAtt(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getAnnexTable, upload, getSuffixSelector, updateAnnex} from "@/api/Annex"

export default {
  name: "FileManage",

  data() {
    return {
      dialogTitle: null,
      dialog: null,
      annexTable: [],
      suffixList: [],
      totalPage: 0,
      total: 0,
      queryParam: {
        suffix: null,
        isPublished: null,
        time: null,
        keyword: null,
        pageNo: 1,
        pageSize: 10
      },
      updateForm: {
        id: null,
        name: null,
      }
    }
  },
  // 自定义指令的方法
  // directives: {
  //   // 如果后端不设置跨域，下载下来的文件是损坏的，不能使用
  //   download: {
  //     // 指令的定义
  //     bind: function (el, binding) {
  //       el.addEventListener('click', () => {
  //         const url = binding.value;  // 完整的url则直接使用
  //         const a = document.createElement('a');
  //         // 将url转成blob地址。如果url是一个完整的链接，需要后端开清跨域请求
  //         let fileName = null;
  //         fetch(url).then(res => {
  //           const fileNameEncode = res.headers.get('content-disposition').split('filename=')[1]
  //           fileName = decodeURIComponent(fileNameEncode)
  //           return res.blob()
  //         }).then(blob => { // 将链接地址字符内容转变成blob地址
  //           a.href = URL.createObjectURL(blob)
  //           a.download = fileName // 下载文件的名字
  //           document.body.appendChild(a)
  //           a.click()
  //           a.parentNode.removeChild(a)
  //           window.URL.revokeObjectURL(url)
  //         })
  //       })
  //     }
  //   },
  // },
  created() {
    this.suffixSelector()
    this.getTableData()
  },

  watch: {
    //监听对话框关闭
    dialog: function (value) {
      if (!value) {
        this.updateForm.id = null;
        this.updateForm.name = null;
      }
    }
  },

  methods: {
    //获取分类表格
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
        this.queryParam.startTime = arr[0];
        this.queryParam.endTime = arr[1];
      } else {
        this.queryParam.startTime = null;
        this.queryParam.endTime = null;
      }
      getAnnexTable(this.queryParam).then(res => {
        if (res.success) {
          this.annexTable = res.data;
          this.totalPage = res.totalPage;
          this.total = res.total;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //获取后缀名筛选框
    suffixSelector() {
      getSuffixSelector().then(res => {
        if (res.success) {
          this.suffixList = res.data;
        } else {
          Notification({
            title: '获取文章下拉框失败',
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //使用fetch api下载文件
    downloadAnnex(row) {
      const url = row.downloadAddress;
      const a = document.createElement('a');
      // 将url转成blob地址。如果url是一个完整的链接，需要后端开清跨域请求
      let fileName = null;
      fetch(url).then(res => {
        const fileNameEncode = res.headers.get('content-disposition').split('filename=')[1]
        fileName = decodeURIComponent(fileNameEncode)
        return res.blob()
      }).then(blob => { // 将链接地址字符内容转变成blob地址
        a.href = URL.createObjectURL(blob)
        a.download = fileName // 下载文件的名字
        document.body.appendChild(a)
        a.click()
        a.parentNode.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
    },
    changeAnnex(row) {
      this.dialog = true;
      this.dialogTitle = row.name;
      this.updateForm.id = row.id;
      this.updateForm.extra = row.extra;
      this.updateForm.name = row.name;
    },
    //更新文件属性
    updateAnnexAtt(isRow) {
      let data = {};
      if (isRow) {
        data.id = isRow.id;
        data.isPublished = isRow.isPublished;
      } else {
        data = this.updateForm
      }
      updateAnnex(data).then(res => {
        if (res.success) {
          this.getTableData()
          this.dialog = false
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
</style>
