<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <el-form ref="userForm" :model="user">

        <el-form-item :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]" class="input-prepend restyle" prop="username">
          <div >
            <el-input v-model="user.username" type="text" placeholder="用户名"/>
            <i class="iconfont icon-tubiao211" />
          </div>
        </el-form-item>

        <el-form-item :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]" class="input-prepend" prop="password">
          <div>
            <el-input v-model="user.password" type="password" placeholder="密码"/>
            <i class="iconfont icon-mima"/>
          </div>
        </el-form-item>

        <div class="btn">
          <input type="button" class="sign-in-button" value="登录" @click="submitLogin()">
        </div>
      </el-form>
      <br>
      <!-- 更多登录方式 -->
      <!-- <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li><a id="qq" class="qq" target="_blank" href="#"><i class="iconfont icon-qq"/></a></li>
        </ul>
      </div> -->
    </div>
    <a href="/">返回首页</a>

  </div>
</template>

<script>
import '~/assets/css/sign.css'
import '~/assets/css/iconfont.css'
import cookie from 'js-cookie'

import loginApi from '@/api/ucenter/login'
export default {
  layout: 'sign',

  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      loginInfo: {}
    }
  },

  methods: {
    submitLogin() {
      loginApi.submitLogin(this.user).then(response => {
        if (response.data.success) {
          // 把token存在cookie中
          cookie.set('training_token', response.data.data.userToken, { domain: 'localhost' })
          // 登录成功根据token获取用户信息
          loginApi.getLoginInfo().then(response => {
            this.loginInfo = response.data.data.staffInfo
            // 将用户信息记录cookie
            cookie.set('training_userInfo', this.loginInfo, { domain: 'localhost' })
            // 跳转页面
            this.$router.go(-1)
          })
        }
      })
    }

  }
}
</script>
<style>
   .el-form-item__error{
    z-index: 9999999;
  }
</style>
