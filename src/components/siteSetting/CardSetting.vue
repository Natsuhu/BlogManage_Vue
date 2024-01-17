<template>
  <div>
    <el-form :model="form" label-position="right" label-width="auto">
      <el-form-item label="头像URL" prop="cardAvatar">
        <el-input v-model="form.cardAvatar" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="资料卡昵称" prop="cardName">
        <el-input v-model="form.cardName" style="width: 30%" size="small"></el-input>
      </el-form-item>
      <el-form-item label="资料卡个签">
        <el-input v-model="form.cardSignature" style="width: 30%" size="small"></el-input>
      </el-form-item>
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
        cardSignature: null
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
    }
  }
}
</script>

<style scoped>

</style>
