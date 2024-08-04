<template>
  <div class="login">
    <div ref="container" class="container">
      <div class="form-container">
        <h3>{{ title }}</h3>
        <form ref="loginForm">
          <input v-model="loginForm.username" type="text" placeholder="用户名" required/>
          <input v-model="loginForm.password" type="password" placeholder="密码" required/>
        </form>
        <button @click="handleLogin">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import {login, getBackLoginSetting} from '@/api/Login'

export default {
  name: 'Login',
  data() {
    return {
      title: '欢迎登录博客后台',
      loginForm: {
        username: 'Visitor',
        password: 'visitor'
      },
      bgImage: null
    }
  },
  async mounted() {
    this.$refs.container.style.backgroundColor = '#2d3a4b'
    //获取博客背景图链接
    const res = await getBackLoginSetting();
    if (res.success) {
      this.bgImage = res.data
    }
    //设置背景图
    if (this.bgImage != null) {
      const img = new Image();
      img.src = this.bgImage;
      img.onload = () => {
        //图片加载完成才显示
        this.$refs.container.style.backgroundImage = `url(${this.bgImage})`;
      };
    }
  },
  methods: {
    handleLogin() {
      const checkResult = this.$refs.loginForm.checkValidity()
      if (checkResult) {
        login(this.loginForm).then(res => {
          if (res.success) {
            this.msgSuccess("登录成功");
            window.localStorage.setItem('token', res.data.token)
            this.$router.push('/')
          } else {
            this.msgError(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

.container {
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.form-container {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  z-index: 1;
}

h3 {
  color: white;
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

input:focus {
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  background-color: #0e7ded;
  color: white;
  cursor: pointer;
  font-weight: bold;
}
</style>
