<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="头像" prop="cardAvatar">
            <el-input v-model="form.cardAvatar" size="small" placeholder="可填写文件ID或外部链接"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="cardName">
            <el-input v-model="form.cardName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="个签" prop="cardSignature">
            <el-input v-model="form.cardSignature" size="small"></el-input>
          </el-form-item>
          <el-row :gutter="15" v-for="(item, index) in form.cardCustom" :key="index">
            <el-col :span="6">
              <el-form-item label="标题" prop="cardCustom">
                <el-input v-model="item.title" size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="内容" prop="cardCustom">
                <el-input v-model="item.content" size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-popconfirm confirm-button-text='好' cancel-button-text='手滑了' icon="el-icon-info" icon-color="red"
                             title="确定删除吗？" @onConfirm="removeCustom(index)">
                <i slot="reference" class="el-icon-delete base_text_point"/>
              </el-popconfirm>
            </el-col>
          </el-row>
          <el-button icon="el-icon-plus" type="primary" size="small" @click="addCustom">添加自定义</el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Github" prop="github">
            <el-input v-model="form.github" size="small"></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="form.qq" size="small"></el-input>
          </el-form-item>
          <el-form-item label="Bilibili" prop="bilibili">
            <el-input v-model="form.bilibili" size="small"></el-input>
          </el-form-item>
          <el-form-item label="网易云" prop="netease">
            <el-input v-model="form.netease" size="small"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      <el-form-item>
              <el-button @click="updateSetting" type="primary">保存</el-button>
            </el-form-item>-->

    </el-form>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {getCardSetting, updateCardSetting} from "@/api/Setting";

export default {
  name: "CardSetting",

  data() {
    return {
      form: {
        cardAvatar: null,
        cardName: null,
        cardSignature: null,
        github: null,
        qq: null,
        bilibili: null,
        netease: null,
        email: null,
        cardCustom: null
      }
    }
  },
  created() {
    this.getSetting();
  },
  destroyed() {
    this.form = null;
  },
  methods: {
    getSetting() {
      getCardSetting().then(res => {
        if (res.success) {
          this.form.cardAvatar = res.data.cardAvatar;
          this.form.cardName = res.data.cardName;
          this.form.cardSignature = res.data.cardSignature
          this.form.github = res.data.github;
          this.form.qq = res.data.qq;
          this.form.bilibili = res.data.bilibili;
          this.form.netease = res.data.netease;
          this.form.email = res.data.email;
          this.form.cardCustom = res.data.cardCustom;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    updateSetting() {
      updateCardSetting(this.form).then(res => {
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
    addCustom() {
      let custom = {}
      custom.title = ''
      custom.content = ''
      this.form.cardCustom.push(custom)
    },
    removeCustom(row) {
      this.form.cardCustom.splice(row, 1)
    }
  }
}
</script>

<style scoped>
.el-icon-delete {
  position: relative;
  top: 8px;
  font-size: 1.2rem;
  font-weight: 100;
  color: #F56C6C;
}
</style>
