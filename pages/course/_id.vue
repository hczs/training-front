<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 课程详情 -->
    <section class="container">

      <!-- 导航 -->
      <section class="path-wrap txtOf hLh30">
        <a href="#" title class="c-999 fsize14">首页</a>
        \
        <a href="/course" title class="c-999 fsize14">课程列表</a>
        \
        <span class="c-333 fsize14">{{ course.categoryLevelOne }}</span>
        \
        <span class="c-333 fsize14">{{ course.categoryLevelTwo }}</span>
      </section>

      <!-- 课程基本信息 -->
      <div>
        <article class="c-v-pic-wrap" style="height: 357px;">
          <section id="videoPlay" class="p-h-video-box">
            <img :src="course.cover" :alt="course.title" class="dis c-v-pic" style="width: 100%; height: 100%">
          </section>
        </article>
        <aside class="c-attr-wrap">
          <section class="ml20 mr15">
            <h2 class="hLh30 txtOf mt15">
              <span class="c-fff fsize24">{{ course.title }}</span>
            </h2>
            <section class="c-attr-mt c-attr-undis">
              <span class="c-fff fsize14">主讲： {{ course.teacherName }}&nbsp;&nbsp;&nbsp;</span>
            </section>
            <section class="c-attr-mt of">
              <br>
              <br>
            </section>
            <section class="c-attr-mt">
              <br>
              <br>

              <a v-if="!isStudy" href="javascript:void(0)" title="参与课程" class="comm-btn c-btn-3" @click="joinCourse">参与课程</a>
              <a v-else :href="'/course/study/'+courseId" title="已参与，立即学习" class="comm-btn c-btn-3">已参与，立即学习</a>
            </section>
          </section>
        </aside>
        <aside class="thr-attr-box">
          <ol class="thr-attr-ol clearfix">
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">课时数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ course.lessonNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">学习人数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ course.learningNum }}</h6>
              </aside>
            </li>
            <li>
              <p>&nbsp;</p>
              <aside>
                <span class="c-fff f-fM">浏览数</span>
                <br>
                <h6 class="c-fff f-fM mt10">{{ course.viewCount }}</h6>
              </aside>
            </li>
          </ol>
        </aside>
        <div class="clear"/>
      </div>
      <!-- tab标签页切换（课程详情和评论） -->
      <div class="mt20 c-infor-box">
        <article class="fl col-7">
          <section class="mr30">
            <div class="i-box">
              <div>
                <section id="c-i-tabTitle" class="c-infor-tabTitle c-tab-title">
                  <a :class="{ current : isCourseInfo}" href="javascript:void(0)" name="c-i" title="课程详情" @click="shwoInfo">课程详情</a>
                  <a :class="{ current : isComment}" href="javascript:void(0)" name="c-i" title="课程评论" @click="showComment">课程评论</a>
                </section>
              </div>
              <!-- 课程详情 -->
              <article v-if="isCourseInfo" class="ml10 mr10 pt20">
                <!-- 课程介绍 -->
                <div>
                  <h6 class="c-i-content c-infor-title">
                    <span>课程介绍</span>
                  </h6>
                  <div class="course-txt-body-wrap">
                    <section class="course-txt-body">
                      <!-- 将内容中的html翻译过来 -->
                      <p v-html="course.description">{{ course.description }}</p>
                    </section>
                  </div>
                </div>

                <!-- 课程大纲-->
                <div class="mt50">
                  <h6 class="c-g-content c-infor-title">
                    <span>课程大纲</span>
                  </h6>
                  <section class="mt20">
                    <div class="lh-menu-wrap">
                      <menu id="lh-menu" class="lh-menu mt10 mr10">
                        <ul>
                          <!-- 课程章节目录 -->
                          <li v-for="chapter in chapterList" :key="chapter.id" class="lh-menu-stair">
                            <em class="lh-menu-i-1 icon18 mr10"/>{{ chapter.title }}
                            <ol class="lh-menu-ol" style="display: block;">
                              <li v-for="video in chapter.children" :key="video.id" class="lh-menu-second ml30">
                                <em class="lh-menu-i-2 icon16 mr5">&nbsp;</em>{{ video.title }}
                              </li>
                            </ol>
                          </li>
                        </ul>
                      </menu>
                    </div>
                  </section>
                </div>
              </article>
              <!-- 课程评论 -->
              <div v-if="isComment" class="mt50 commentHtml">
                <div>
                  <h6 id="i-art-comment" class="c-c-content c-infor-title">
                    <span class="commentTitle">课程评论</span>
                  </h6>
                  <section v-if="isLogin" class="lh-bj-list pr mt20 replyhtml">
                    <ul>
                      <li class="unBr">
                        <aside class="noter-pic">
                          <img :src="userInfo.avatar" width="50" height="50" class="picImg">
                        </aside>
                        <div class="of">
                          <section class="n-reply-wrap">
                            <fieldset>
                              <textarea id="commentContent" v-model="comment.content" name="" placeholder="输入您要评论的文字"/>
                            </fieldset>
                            <p class="of mt5 tar pl10 pr10">
                              <span class="fl "><tt class="c-red commentContentmeg" style="display: none;"/></span>
                              <input type="button" value="评论" class="lh-reply-btn" @click="addComment()">
                            </p>
                          </section>
                        </div>
                      </li>
                    </ul>
                  </section>
                  <section class="">
                    <section class="question-list lh-bj-list pr">
                      <ul class="pr10">
                        <li v-for="(comment,index) in data.rows" :key="index">
                          <aside class="noter-pic">
                            <img :src="comment.avatar" width="50" height="50" class="picImg">
                          </aside>
                          <div class="of">
                            <span class="fl">
                              <font class="fsize12 c-blue">
                                {{ comment.username }}</font>
                            <font class="fsize12 c-999 ml5">评论：</font></span>
                          </div>
                          <div class="noter-txt mt5">
                            <p>{{ comment.content }}</p>
                          </div>
                          <div class="of mt5">
                            <span class="fr"><font class="fsize12 c-999 ml5">{{ comment.createTime }}</font></span>
                          </div>
                        </li>
                      </ul>
                    </section>
                  </section>

                  <!-- 评论分页 -->
                  <div class="tac">
                    <el-pagination
                      :current-page="data.current"
                      :page-size="data.size"
                      :total="data.total"
                      background
                      layout="total, prev, pager, next, jumper"
                      @current-change="gotoPage" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
        <aside class="fl col-3">
          <div class="i-box">
            <!-- 主讲讲师-->
            <div>
              <section class="c-infor-tabTitle c-tab-title">
                <a title href="javascript:void(0)">主讲讲师</a>
              </section>
              <section class="stud-act-list">
                <ul style="height: auto;">
                  <li>
                    <div class="u-face">
                      <img :src="course.avatar" width="50" height="50" alt>
                    </div>
                    <section class="hLh30 txtOf">
                      <a class="c-333 fsize16 fl">{{ course.teacherName }}</a>
                    </section>
                    <section class="hLh20 txtOf">
                      <span class="c-999">{{ course.introduce }}</span>
                    </section>
                  </li>
                </ul>
              </section>
            </div>

          </div>
        </aside>
        <div class="clear"/>
      </div>
    </section>

  </div>
</template>

<script>
import course from '@/api/learning/course'
import comment from '@/api/learning/comment'
import staffCourse from '@/api/learning/staffCourse'
import cookie from 'js-cookie'

export default {
  asyncData({ params, error }) {
    return { courseId: params.id }
  },

  data() {
    return {
      data: {},
      page: 1,
      limit: 5,
      comment: {},
      course: {},
      chapterList: [],
      isCourseInfo: true,
      isComment: false,
      userInfo: {}, // 用户信息
      isStudy: false, // 员工是否已经参与了本课程的学习
      isLogin: false // 是否登录
    }
  },

  mounted() {
    // 初始化课程信息
    this.initCourseInfo()
    // 获取用户信息
    this.getUserInfo()
    // 用户是否学习了指定课程
    this.isStudyCourse()
  },

  methods: {
    // 展示用户信息
    getUserInfo() {
      // 获取用户信息
      var jsonStr = cookie.get('training_userInfo')
      if (jsonStr != null && jsonStr !== 'undefined' && jsonStr !== '') {
        this.isLogin = true
        this.userInfo = JSON.parse(jsonStr)
      }
    },
    // （tab页签切换）展示课程详情信息
    shwoInfo() {
      this.isCourseInfo = true
      this.isComment = false
    },
    // （tab页签切换）展示评论信息
    showComment() {
      this.initComment()
      this.isComment = true
      this.isCourseInfo = false
    },
    // 获取课程详情
    initCourseInfo() {
      course.getCourseInfo(this.courseId)
        .then(response => {
          this.course = response.data.data.courseInfo
          this.chapterList = response.data.data.chapterInfo
        })
    },

    // 参与课程
    joinCourse() {
      course.joinCourse(this.courseId)
        .then(response => {
          console.log(response)
          if (response.data.code === 200) {
            // 弹窗参与成功
            this.$message({
              type: 'success',
              message: '参加课程成功！'
            })
            // 重新更新下按钮
            this.isStudyCourse()
          }
        })
    },

    // 用户是否学习了指定课程
    isStudyCourse() {
      staffCourse.isStudyCourse(this.courseId, this.userInfo.id)
        .then(response => {
          this.isStudy = response.data.data.isStudy
        })
    },

    // 评论相关
    // 初始化评论信息
    initComment() {
      comment.getPageList(this.page, this.limit, this.courseId).then(response => {
        this.data = response.data.data
      })
    },
    // 添加评论
    addComment() {
      this.comment.courseId = this.courseId
      this.comment.teacherId = this.course.teacherId
      comment.addComment(this.comment).then(response => {
        if (response.data.success) {
          this.comment.content = ''
          this.initComment()
        }
      })
    },
    // 评论页数跳转处理
    gotoPage(page) {
      comment.getPageList(page, this.limit, this.courseId).then(response => {
        this.data = response.data.data
      })
    }
  }
}
</script>
