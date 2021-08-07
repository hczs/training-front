<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
        <div style="float: right">
          <el-input v-model="searchObj.title" placeholder="请输入课程名称" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="gotoPage(page)"/>
          </el-input>
        </div>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a title="全部" href="javascript:void(0);" @click="searchOne('')">全部</a>
                </li>
                <li v-for="(item,index) in categoryNestedList" :key="index" :class="{active:oneIndex==index}">
                  <a :title="item.title" href="javascript:void(0);" @click="searchOne(item.id, index)">{{ item.title }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"/>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li v-for="(item,index) in subCategoryList" :key="index" :class="{active:twoIndex==index}">
                  <a :title="item.title" href="javascript:void(0);" @click="searchTwo(item.id, index)">{{ item.title }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear"/>
        </section>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section v-if="data.total === 0" class="no-data-wrap">
            <span class="c-666 fsize14 ml10 vam">该分类暂时没有发布课程哦...</span>
          </section>
          <!-- /无数据提示 结束-->
          <!-- 数据列表 开始-->
          <article v-if="data.total>0" class="comm-course-list">
            <ul id="bna" class="of">
              <li v-for="item in data.courses" :key="item.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :src="item.cover" class="img-responsive" style="height: 200px; width: 340px">
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
          <!-- /数据列表 结束-->
        </div>
        <div class="tac">
          <el-pagination
            :current-page="data.current"
            :page-size="data.size"
            :total="data.total"
            background
            layout="total, prev, pager, next, jumper"
            @current-change="gotoPage" />
        </div>
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import course from '@/api/learning/course'
import category from '@/api/learning/category'
export default {

  data() {
    return {
      page: 1, // 默认多少页
      limit: 8, // 每页多少个
      data: {}, // 课程数据
      categoryNestedList: [], // 一级分类列表
      subCategoryList: [], // 二级分类列表
      searchObj: {}, // 查询表单对象
      oneIndex: -1,
      twoIndex: -1
    }
  },

  // 加载完渲染时
  created() {
    // 获取课程列表
    this.initCourse()
    // 获取分类
    this.initCategory()
  },

  methods: {
    // 查询课程列表
    initCourse() {
      course.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.data = response.data.data
      })
    },
    // 查询所有一级分类
    initCategory() {
      // debugger
      category.getTreeList().then(response => {
        this.categoryNestedList = response.data.data.items
      })
    },

    // 点击一级分类，显示对应的二级分类，查询数据
    searchOne(categoryParentId, index) {
      // debugger
      this.oneIndex = index
      this.twoIndex = -1

      this.searchObj.categoryId = ''
      this.subCategoryList = []

      this.searchObj.categoryParentId = categoryParentId
      this.gotoPage(this.page)

      for (let i = 0; i < this.categoryNestedList.length; i++) {
        if (this.categoryNestedList[i].id === categoryParentId) {
          this.subCategoryList = this.categoryNestedList[i].children
        }
      }
    },

    // 点击二级分类，查询数据
    searchTwo(categoryId, index) {
      this.twoIndex = index
      this.searchObj.categoryId = categoryId
      this.gotoPage(this.page)
    },

    // 分页查询
    gotoPage(page) {
      this.page = page
      course.getPageList(page, this.limit, this.searchObj).then(response => {
        this.data = response.data.data
      })
    }
  }
}
</script>
<style scoped>
  .active {
    background: #bdbdbd;
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
</style>
