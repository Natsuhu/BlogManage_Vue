<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef" label-position="top">
      <el-row class="base_margin_b">
        <el-container>
          <el-header>
            <div style="border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
              写动态
            </div>
            <div>
              <!-- 提交表单 -->
              <el-button type="primary" @click="submit">{{ buttonText }}</el-button>
            </div>
          </el-header>

          <el-main>
            <el-row :gutter="20">
              <!-- 文章标题 -->
              <el-col :span="6">
                <el-form-item label="作者" prop="author">
                  <el-input v-model="form.author" placeholder="输入作者"></el-input>
                </el-form-item>
              </el-col>

              <!-- 设置点赞数 -->
              <el-col :span="6">
                <el-form-item label="点赞数" prop="likes">
                  <el-input v-model="form.likes" placeholder="输入点赞数" type="number"></el-input>
                </el-form-item>
              </el-col>

              <!-- 设置发布时间 -->
              <el-col :span="6">
                <el-form-item label="发布时间" prop="publishTime">
                  <el-date-picker
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="form.publishTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      default-time="12:00:00">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <!-- 权限 -->
              <el-col :span="6">
                <el-form-item label="权限">
                  <el-checkbox-button class="base_margin_r" v-model="form.isPublished" true-label="true" false-label="false">公开</el-checkbox-button>
                  <el-checkbox-button v-model="form.isCommentEnabled" true-label="true" false-label="false">评论</el-checkbox-button>
                </el-form-item>
              </el-col>

            </el-row>
          </el-main>
        </el-container>
      </el-row>

      <el-row>
        <el-container>
          <el-header>
            <div style="border-left: 3px solid #1882C4; padding-left: 1rem; color: #1882C4; font-size: 18px">
              编辑内容
            </div>
          </el-header>
          <el-main>
            <!-- 动态内容 -->
            <el-form-item label="动态内容" prop="content">
              <mavon-editor ref="content" :autofocus="false" :boxShadow="false" @imgAdd="imgAdd" v-model="form.content"/>
            </el-form-item>
          </el-main>
        </el-container>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import {Notification} from "element-ui";
import {saveMoment, getUpdateMoment, updateMoment} from '@/api/Moment';
import {upload, deleteAnnex} from "@/api/Annex";

export default {
  name: "WriteMoment",

  data() {
    return {
      momentId: null,
      buttonText: null,
      form: {
        author: 'NatsuKaze',
        likes: 0,
        publishTime: null,
        isPublished: true,
        isCommentEnabled: false,
        content: ''
      },
      formRules: {
        content: [{required: true, message: '请输入动态内容', trigger: 'change'}]
      }
    }
  },

  created() {
    if (this.$route.params.id != null) {
      this.momentId = this.$route.params.id
    }
    //更新按钮文本
    if (this.momentId != null) {
      this.buttonText = '更新';
      this.getMoment(this.momentId);
    } else {
      this.buttonText = '保存';
    }
  },

  watch: {
    //监听momentId变化改变按钮的文本
    'momentId'(newValue) {
      if (newValue != null) {
        this.buttonText = '更新';
      } else {
        this.buttonText = "保存";
      }
    }
  },

  methods: {
    //通过ID获取动态
    getMoment(id) {
      getUpdateMoment(id).then(res => {
        if (res.success) {
          this.form.author = res.data.author;
          this.form.likes = res.data.likes;
          this.form.publishTime = res.data.publishTime;
          this.form.isPublished = res.data.isPublished;
          this.form.isCommentEnabled = res.data.isCommentEnabled;
          this.form.content = res.data.content;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //提交
    submit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.momentId != null) {
            this.form.id = this.momentId
            updateMoment(this.form).then(res => {
              if (res.success) {
                this.$refs.formRef.resetFields();
                this.form.author = 'NatsuKaze';
                this.form.likes = 0;
                this.form.isPublished = true;
                this.form.isCommentEnabled = false;
                //弹窗提示
                Notification({
                  title: '更新成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                //弹窗提示
                Notification({
                  title: '更新失败',
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          } else {
            saveMoment(this.form).then(res => {
              if (res.success) {
                this.$refs.formRef.resetFields();
                this.form.author = 'NatsuKaze';
                this.form.likes = 0;
                this.form.isPublished = true;
                this.form.isCommentEnabled = false;
                //弹窗提示
                Notification({
                  title: '保存成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                //弹窗提示
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
    },
    //文件上传
    imgAdd(pos, file) {
      let form = new FormData();
      form.append('file', file);
      form.append('isPublished', true);
      upload(form).then(res => {
        if (res.success) {
            this.$refs.content.$img2Url(pos, res.data)
        } else {
          Notification({
            title: '上传失败',
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
.el-container {
  background-color: #FFFFFF;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgb(241, 242, 243);
}

/*权限按钮组，设置圆角*/
::v-deep .el-checkbox-button__inner {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: all .2s cubic-bezier(.645,.045,.355,1);
}

::v-deep .el-checkbox-button:first-child .el-checkbox-button__inner {
  border-radius: 4px;
}

::v-deep .el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 4px;
}

.v-note-wrapper {
  font-family: inherit;
  letter-spacing: 1px;
  position: static !important;
  border: 1px solid rgb(220, 223, 230) !important;
}
::v-deep .v-note-op {
  z-index: unset !important;
}

.el-date-editor {
  width: 100%;
}

.el-checkbox {
  margin-left: 0px !important;
  margin-right: 1rem !important;
}
</style>
