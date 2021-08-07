<template>
  <div>
    <!-- 通用头 -->
    <div style="margin-top: 20px">
      <!-- 导航栏 -->
      <el-menu
        :default-active="activerouter"
        class="el-menu-demo"
        router
        mode="horizontal"
        @select="handleSelect">
        <el-menu-item index="/" style="margin-left: 10%; font-size: 20px">
          首页
        </el-menu-item>
        <el-menu-item index="/course" style="margin-left: 35px; font-size: 20px">
          课程
        </el-menu-item>
        <el-menu-item index="/question" style="margin-left: 35px; font-size: 20px">
          问答
        </el-menu-item>
        <el-menu-item index="/plan" style="margin-left: 35px; font-size: 20px">
          培训计划
        </el-menu-item>
        <!-- <el-menu-item index="/test" style="margin-left: 35px; font-size: 20px">
          测试页面
        </el-menu-item> -->
        <!-- 搜索框 -->
        <el-menu-item v-if="!isLogin" index="/login" style="float: right; font-size: 15px">
          登录 | 注册
        </el-menu-item>
        <el-submenu v-if="isLogin" index="/ucenter" style="float: right; font-size: 15px">
          <template slot="title">
            欢迎您，{{ userInfo.username }}
          </template>
          <el-menu-item index="/ucenter">个人中心</el-menu-item>
          <el-menu-item @click="logout">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- 页面内容 -->
    <nuxt/>

  </div>
</template>
<script>
import '~/assets/css/reset.css'
import '~/assets/css/theme.css'
import '~/assets/css/global.css'
import '~/assets/css/web.css'

import cookie from 'js-cookie'

export default {
  data() {
    return {
      activerouter: '/',
      userInfo: {},
      isLogin: false // 默认没有登录
    }
  },

  created() {
    this.showInfo()
  },

  mounted() {
    // 截取路由，切换菜单
    const defaultMenu = '/' + window.location.href.split('/')[3]
    this.activerouter = defaultMenu
  },

  methods: {
    // 切换导航处理
    handleSelect(key, keyPath) {
      this.activerouter = key
      console.log(key, keyPath)
    },
    // 展示用户信息
    showInfo() {
      // 获取用户信息
      var jsonStr = cookie.get('training_userInfo')
      if (jsonStr != null && jsonStr !== 'undefined' && jsonStr !== '') {
        this.isLogin = true
        this.userInfo = JSON.parse(jsonStr)
      }
    },
    // 退出登录
    logout() {
      this.isLogin = false
      // 清空用户信息和token
      cookie.set('training_userInfo', '', { domain: 'localhost' })
      cookie.set('training_token', '', { domain: 'localhost' })

      // 回到首页
      window.location.href = '/'
    }
  }
}
</script>
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
