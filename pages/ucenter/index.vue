<template>
  <div>
    <div class="mt20 c-infor-box" style="margin-left: 150px; margin-right: 150px">
      <div class="i-box">
        <div>
          <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
            <a :class="{ current : myCourse}" href="javascript:void(0)" name="c-i" title="我参与的课程" @click="shwoMyCourse">我参加的课程</a>
            <a :class="{ current : myQuestion}" href="javascript:void(0)" name="c-i" title="我的提问" @click="showMyQuestion">我的提问</a>
            <a :class="{ current : myAnswer}" href="javascript:void(0)" name="c-i" title="我的回答" @click="showMyAnswer">我的回答</a>
            <a :class="{ current : isUserInfo}" href="javascript:void(0)" name="c-i" title="账号设置" @click="showUserInfo">账号设置</a>
          </section>
        </div>
        <!-- 我参与的课程 -->
        <article v-if="myCourse" class="ml10 mr10 pt20">
          <h3 class="tac">您在本站已经学习 {{ Math.floor(myLearningTime/3600) }} 时 {{ Math.floor(myLearningTime%3600/60) }} 分 {{ myLearningTime%3600%60 }} 秒，请继续努力学习~</h3>
          <el-divider/>
          <div id="aCoursesList">
            <!-- 无数据提示-->
            <section v-if="total === 0" class="no-data-wrap">
              <span class="c-666 fsize14 ml10 vam">您还没有参与任何课程哦...</span>
            </section>
            <!-- 无数据提示 结束-->
            <!-- 课程数据列表 -->
            <div>
              <div v-for="course in courseData" :key="course.courseId" style="font-size: 16px">
                <el-link :href="'/course/'+course.courseId">{{ course.title }}</el-link>
                <br>
                <span v-if="course.accomplishFlag === 0">学习状态：未完成课程</span>
                <span v-else>学习状态：已完成课程</span>
                <br>
                <span>完成进度：</span>
                <el-progress :format="format" :percentage="( (course.learningVideoNum / course.allVideoNum) * 100 ).toFixed(1)" style="width: 600px"/>
                <el-divider/>
              </div>
            </div>
            <!-- 分页 -->
            <div class="tac">
              <el-pagination
                v-if="total > limit"
                :current-page="page"
                :page-size="limit"
                :total="total"
                background
                layout="total, prev, pager, next, jumper"
                @current-change="gotoCoursePage" />
            </div>
            <!-- 课程列表结束-->
          </div>
        </article>

        <!-- 我参与的讨论 -->
        <div v-if="myQuestion" class="mt50 commentHtml">
          <div>
            <div v-for="question in myQuestionList" :key="question.id" style="font-size: 15px">
              【{{ question.answerNum }}个回答】
              <el-link :href="'/question/'+question.id">{{ question.title }}</el-link>
              <div style="float: right">{{ question.createTime }}</div>
              <el-divider/>
            </div>
            <!-- 分页 -->
            <div class="tac">
              <el-pagination
                v-if="total > limit"
                :current-page="page"
                :page-size="limit"
                :total="total"
                background
                layout="total, prev, pager, next, jumper"
                @current-change="gotoQuestionPage" />
            </div>
          </div>
        </div>
        <!-- 参与的讨论，结束 -->
        <!-- 我的回答，开始 -->
        <div v-if="myAnswer" class="mt50 commentHtml">
          <div v-for="answer in myAnswerList" :key="answer.id" style="font-size: 15px">
            <el-link :href="'/question/'+answer.id">{{ answer.title }}</el-link>
            <div style="float: right">{{ answer.createTime }}</div>
            <el-divider/>
          </div>
          <!-- 分页 -->
          <div class="tac">
            <el-pagination
              v-if="total > limit"
              :current-page="page"
              :page-size="limit"
              :total="total"
              background
              layout="total, prev, pager, next, jumper"
              @current-change="gotoQuestionPage" />
          </div>
        </div>
        <!-- 我的回答，结束 -->
        <div v-if="isUserInfo">
          <br>
          <br>
          <el-tabs tab-position="left" style="height: 100%" @tab-click="handleClick">
            <el-tab-pane label="基本资料修改">
              <el-form ref="userInfo" :model="userInfo" label-width="100px" style="margin-left: 50px">
                <el-form-item label="头像">
                  <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    action="http://localhost:8888/oss/file/upload"
                    class="avatar-uploader">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"/>
                  </el-upload>
                </el-form-item>
                <el-form-item label="用户名">
                  <el-input :disabled="true" v-model="userInfo.username"/>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender" >
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input v-model="userInfo.introduce" type="textarea"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateUserInfo">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="密码修改">
              <el-form ref="passwordVo" :model="passwordVo" label-width="100px" style="margin-left: 50px">
                <el-form-item :rules="[{ required: true, message: '请输入原密码', trigger: 'blur' }]" prop="oldPassword" label="原密码">
                  <el-input v-model="passwordVo.oldPassword" type="password" placeholder="请输入原密码"/>
                </el-form-item>
                <el-form-item :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]" prop="newPassword" label="新密码">
                  <el-input v-model="passwordVo.newPassword" type="password" placeholder="设置新密码"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updatePassword">提交修改</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="clear"/>
    </div>
  </div>
</template>
<script>
import staffCourse from '@/api/learning/staffCourse'
import staffVideo from '@/api/learning/staffVideo'
import staff from '@/api/ucenter/staff'
import login from '@/api/ucenter/login'

import question from '@/api/qa/question'
import answer from '@/api/qa/answer'

import cookie from 'js-cookie'

export default {
  data() {
    return {
      page: 1,
      limit: 4,
      total: 0,
      form: {},
      courseData: {},
      myLearningTime: 0,
      myCourse: true, // 我参与的课程
      myQuestion: false, // 我参与的讨论
      myAnswer: false, // 我的回答
      isUserInfo: false, // 基本资料修改
      userInfo: {}, // 用户信息
      myQuestionList: [], // 我的提问列表
      myAnswerList: [], // 我的回答列表
      passwordVo: {} // 修改密码vo
    }
  },

  mounted() {
    setTimeout(() => { // 设置延迟执行
      this.getMyJoinCourse()
      this.getMyLearningTime()
    }, 200)
  },

  created() {
    this.getUserInfo()
  },

  methods: {

    format(percentage) {
      return percentage === 100 ? '已完成' : `${percentage}%`
    },
    // 展示用户信息
    getUserInfo() {
      // 获取用户信息
      var jsonStr = cookie.get('training_userInfo')
      if (jsonStr != null && jsonStr !== 'undefined' && jsonStr !== '') {
        console.log(this.userInfo)
        this.userInfo = JSON.parse(jsonStr)
      }
    },
    // 展示我参与的课程
    shwoMyCourse() {
      // 重置分页信息
      this.page = 1
      this.limit = 4
      this.total = 0
      // 关闭其他页面显示
      this.myQuestion = false
      this.myAnswer = false
      this.isUserInfo = false
      // 查询我参与的课程
      this.getMyJoinCourse()
      this.myCourse = true
    },
    // 展示我参与的评论
    showMyQuestion() {
      // 清空分页信息
      this.page = 1
      this.limit = 6
      this.total = 0
      // 关闭其他页面显示
      this.myCourse = false
      this.myAnswer = false
      this.isUserInfo = false
      // 显示我的提问
      this.getMyQuestion()
      this.myQuestion = true
    },
    // 展示我的回答
    showMyAnswer() {
      // 清空分页信息
      this.page = 1
      this.limit = 6
      this.total = 0
      // 关闭其他页面显示
      this.myCourse = false
      this.myQuestion = false
      this.isUserInfo = false
      // 展示我的回答
      this.getMyAnswerQuestion()
      this.myAnswer = true
    },
    // 展示我的基本资料
    showUserInfo() {
      // 关闭其他页面显示
      this.myCourse = false
      this.myQuestion = false
      this.myAnswer = false
      // 展示基本资料
      this.isUserInfo = true
      this.getBaseInfo()
    },
    // 获取我参与的课程
    getMyJoinCourse() {
      staffCourse.getMyJoinCourse(this.page, this.limit)
        .then(response => {
          this.courseData = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 获取我的学习总时长
    getMyLearningTime() {
      console.log(this.userInfo)
      staffVideo.getLearningTime(this.userInfo.id)
        .then(response => {
          console.log(response)
          this.myLearningTime = response.data.data.learningTime
        })
    },

    // 获取我的提问
    getMyQuestion() {
      question.myQuestion(this.page, this.limit)
        .then(response => {
          console.log(response)
          this.myQuestionList = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 获取我回答过的问题
    getMyAnswerQuestion() {
      console.log('jinlail')
      answer.getMyAnswer(this.page, this.limit, this.userInfo.id)
        .then(response => {
          console.log(response)
          this.myAnswerList = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 账号设置相关方法
    // 处理标签切换方法
    handleClick(tab, event) {
      console.log(tab, event)
    },

    // 获取用户基本资料信息
    getBaseInfo() {
      this.userInfo = {}
      login.getLoginInfo()
        .then(response => {
          this.userInfo = response.data.data.staffInfo
        })
    },

    // 更新用户信息
    updateUserInfo() {
      staff.updateUserInfo(this.userInfo)
        .then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改资料成功！'
            })
          }
        })
    },

    // 更新密码
    updatePassword() {
      this.passwordVo.id = this.userInfo.id
      console.log(this.passwordVo)
      staff.updatePassword(this.passwordVo)
        .then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '密码修改成功，下次登录请使用新密码！'
            })
          }
        })
    },

    // 课程列表切换
    gotoCoursePage(page) {
      staffCourse.getMyJoinCourse(page, this.limit)
        .then(response => {
          this.courseData = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 我的提问分页切换
    gotoQuestionPage(page) {
      question.myQuestion(page, this.limit)
        .then(response => {
          console.log(response)
          this.myQuestionList = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 头像上传相关
    // 成功上传
    handleAvatarSuccess(res) {
      this.userInfo.avatar = res.data.url
    },

    // 校验上传图片的大小是否符合要求（还可以校验格式等等）
    beforeAvatarUpload(file) {
      const isJPGorPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M && isJPGorPng
    }
  }
}
</script>
<style scoped>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
