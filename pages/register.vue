<template>
  <div class="main">
    <div class="title">
      <a href="/login">登录</a>
      <span>·</span>
      <a class="active" href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <el-form ref="userForm" :model="params">

        <el-form-item :rules="[{ required: true, message: '请输入你的用户名', trigger: 'blur' }]" class="input-prepend restyle" prop="username">
          <div>
            <i class="iconfont icon-tubiao211"/>
            <el-input v-model="params.username" type="text" placeholder="用户名"/>
          </div>
        </el-form-item>

        <el-form-item :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' },{validator: checkMail, trigger: 'blur'}]" class="input-prepend restyle no-radius" prop="mail">
          <div>
            <el-input v-model="params.mail" type="text" placeholder="邮箱"/>
            <i class="iconfont icon-huaban14"/>
          </div>
        </el-form-item>

        <el-form-item :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]" class="input-prepend restyle no-radius" prop="code">
          <div style="width: 100%;display: block;float: left;position: relative">
            <el-input v-model="params.code" type="text" placeholder="验证码"/>
            <i class="iconfont icon-yanzhengma"/>
          </div>
          <div class="btn" style="position:absolute;right: 0;top: 6px;width: 40%;">
            <a :value="codeTest" href="javascript:" type="button" style="border: none;background-color: none" @click="getCodeFun()">{{ codeTest }}</a>
          </div>
        </el-form-item>

        <el-form-item :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]" class="input-prepend" prop="password">
          <div>
            <el-input v-model="params.password" type="password" placeholder="设置密码"/>
            <i class="iconfont icon-mima"/>
          </div>
        </el-form-item>

        <div class="btn">
          <input type="button" class="sign-up-button" value="注册" @click="submitRegister()">
        </div>
      </el-form>
      <br>
      <!-- 更多注册方式 -->
      <!-- <div class="more-sign">
        <h6>社交帐号直接注册</h6>
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

import registerApi from '@/api/ucenter/register'

export default {
  layout: 'sign',
  data() {
    return {
      params: {
        mail: '',
        code: '',
        username: '',
        password: ''
      },
      sending: true, // 是否发送验证码
      second: 60, // 倒计时间
      codeTest: '获取验证码',
      result: {} // 计时器
    }
  },
  methods: {

    // 获取验证码方法
    getCodeFun() {
      // 发送过了就别发送了
      if (!this.sending) { return }
      // 邮箱为空也不发送了
      if (this.params.mail === '' || this.params.mail === null) {
        this.$message({
          type: 'error',
          message: '请输入邮箱！'
        })
      }
      registerApi.getCode(this.params.mail)
        .then(response => {
          if (response.data.code !== 200) {
            this.$message({
              type: 'error',
              message: response.data.message
            })
          } else {
            this.sending = false
            this.timeDown()
          }
        })
    },

    // 验证码倒计时方法
    timeDown() {
      this.result = setInterval(() => {
        this.second--
        this.codeTest = '已发送(' + this.second + ')'
        if (this.second < 1) {
          clearInterval(this.result)
          this.sending = true
          this.second = 60
          this.codeTest = '获取验证码'
        }
      }, 1000)
    },

    // 提交注册处理
    submitRegister() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          registerApi.submitRegister(this.params).then(response => {
            if (response.data.code !== 200) {
              // 提示注册失败
              this.$message({
                type: 'error',
                message: response.data.message
              })
            } else {
              // 提示注册成功
              this.$message({
                type: 'success',
                message: '注册成功'
              })
              // 登录
              // 把token存在cookie中
              cookie.set('training_token', response.data.data.userToken, { domain: 'localhost' })
              // 登录成功根据token获取用户信息
              loginApi.getLoginInfo().then(response => {
                this.loginInfo = response.data.data.staffInfo
                // 将用户信息记录cookie
                cookie.set('training_userInfo', this.loginInfo, { domain: 'localhost' })
                // 跳转页面
                this.$router.push({ path: '/' })
              })
            }
          })
        }
      })
    },

    // 邮箱格式检查
    checkMail(rule, value, callback) {
      if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
        return callback(new Error('邮箱格式不正确'))
      }
      return callback()
    }
  }
}
</script>
