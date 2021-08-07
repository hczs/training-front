<template>

  <div>
    <!-- 幻灯片 开始 -->
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">

        <div v-for="banner in bannerList" :key="banner.id" class="swiper-slide" style="background: #040B1B;">
          <img :alt="banner.title" :src="banner.imageUrl" style="width:100%; height:100%">
        </div>

      </div>
      <div class="swiper-pagination swiper-pagination-white"/>
      <div slot="button-prev" class="swiper-button-prev swiper-button-white"/>
      <div slot="button-next" class="swiper-button-next swiper-button-white"/>
    </div>
    <!-- 幻灯片 结束 -->

    <div id="aCoursesList">
      <!-- 课程 开始 -->
      <div>
        <section class="container">
          <header class="comm-title">
            <h2 class="tac">
              <span class="c-333">热门课程</span>
            </h2>
          </header>
          <div>
            <article class="comm-course-list">
              <ul id="bna" class="of">
                <li v-for="item in hotCourseList" :key="item.id">
                  <div class="cc-l-wrap">
                    <section class="course-img">
                      <img :src="item.cover" class="img-responsive">
                      <div class="cc-mask">
                        <a :href="'/course/'+item.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                      </div>
                    </section>
                    <h3 class="hLh30 txtOf mt10">
                      <a :href="'/course/'+item.id" :title="item.title" class="course-title fsize18 c-333">{{ item.title }}</a>
                    </h3>
                    <section class="mt10 hLh20 of">
                      <span class="fl jgAttr c-ccc f-fA">
                        <i class="c-999 f-fA">{{ item.learningNum }}人学习</i>
                        |
                        <i class="c-999 f-fA">{{ item.commentNum }}评论</i>
                      </span>
                    </section>
                  </div>
                </li>
              </ul>
              <div class="clear"/>
            </article>
          </div>
        </section>
      </div>
      <!-- /网校课程 结束 -->
    </div>
  </div>
</template>

<script>
import banner from '@/api/home/banner'
import course from '@/api/learning/course'

export default {
  data() {
    return {
      swiperOption: {
        // 配置分页
        pagination: {
          el: '.swiper-pagination'// 分页的dom节点
        },
        // 配置导航
        navigation: {
          nextEl: '.swiper-button-next', // 下一页dom节点
          prevEl: '.swiper-button-prev'// 前一页dom节点
        },
        // 循环播放
        loop: true,
        // 自动播放
        autoplay: true
      },
      bannerList: [], // 轮播图列表
      hotCourseList: [] // 热门课程列表
    }
  },

  created() {
    this.initBanner()
    this.getHotCourseList()
  },

  methods: {
    // 初始化banner数据
    initBanner() {
      banner.getList().then(response => {
        this.bannerList = response.data.data.bannerList
      })
    },

    // 获取热门课程
    getHotCourseList() {
      course.getHotCourses()
        .then(response => {
          this.hotCourseList = response.data.data.rows
        })
    }
  }
}
</script>
