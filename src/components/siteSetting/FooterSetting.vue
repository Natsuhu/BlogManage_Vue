<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="版权信息" prop="copyright">
            <el-input v-model="form.copyright" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ICP备案号" prop="icpInfo">
            <el-input v-model="form.icpInfo" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-for="(badge, index) in form.badgeList" :key="index">
        <el-col :span="5">
          <el-form-item label="key" prop="badgeList">
            <el-input v-model="badge.subject" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="value" prop="badgeList">
            <el-input v-model="badge.value" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="title" prop="badgeList">
            <el-input v-model="badge.title" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="url" prop="badgeList">
            <el-input v-model="badge.url" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-color-picker class="base_margin_r" v-model="badge.color" :predefine="predefineColors" size="mini"/>
          <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                         title="确定删除吗？" @onConfirm="removeBadge(index)">
            <i slot="reference" class="el-icon-delete base_text_point"/>
          </el-popconfirm>
        </el-col>
      </el-row>
      <el-row>
        <el-button icon="el-icon-plus" type="primary" size="small" @click="addBadge">添加徽标</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getFooterSetting, updateFooterSetting} from "@/api/Setting";

export default {
  name: "FooterSetting",
  data() {
    return {
      form: {
        icpInfo: '',
        copyright: '',
        badgeList: []
      },
      //标签预定义颜色
      predefineColors: ['#4dc820', '#d8b024', '#8833d7', '#f26bae', '#e05d44', '#007ec6', '#35bdb2', '#747d8c', '#555555', '#9f9f9f']
    }
  },
  created() {
    this.getSetting()
  },
  methods: {
    getSetting() {
      getFooterSetting().then(res => {
        if (res.success) {
          this.form.icpInfo = res.data.icpInfo
          this.form.copyright = JSON.stringify(res.data.copyright)
          this.form.badgeList = res.data.badgeList
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    updateSetting() {
      let bodyData = {}
      bodyData.icpInfo = this.form.icpInfo
      bodyData.badgeList = this.form.badgeList
      bodyData.copyright = JSON.parse(this.form.copyright)
      updateFooterSetting(bodyData).then(res => {
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
    addBadge() {
      let badge = {}
      badge.subject = ''
      badge.value = ''
      badge.title = ''
      badge.url = ''
      badge.color = '#ffffff'
      this.form.badgeList.push(badge)
    },
    removeBadge(row) {
      this.form.badgeList.splice(row, 1)
    }
  }
}
</script>

<style scoped>
.el-icon-delete {
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}

.el-color-picker {
  top: 5px
}

::v-deep .el-color-picker__trigger {
  border-radius: 50%;
}

::v-deep .el-color-picker__color {
  border-radius: 50%;
}

::v-deep .el-color-picker__color-inner {
  border-radius: 50%;
}

::v-deep .el-color-picker__icon {
  display: none;
}
</style>