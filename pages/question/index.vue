<template>
  <div class="bg-fa of" style="height: 100%">
    <div class="mt50 c-infor-box" style="margin-left: 150px; margin-right: 150px">
      <!-- 顶部提问 -->
      <div style="font-size: 20px; float: right">
        <el-button round type="success" @click="toAsk">
          我要提问
        </el-button>
      </div>
      <br>
      <!-- 提问列表 -->
      <div v-for="question in questionList" :key="question.id" class="mt20">
        <div style="font-size: 20px">
          <a :href="'/question/'+question.id" style="color: black">{{ question.title }}</a>
          <br>
          <br>
        </div>
        <div style="float: left">
          <img :src="question.avatar" style="border-radius:50%" width="15px" height="15px" class="picImg">
          {{ question.username }}
        </div>
        <div style="float: right">
          <span class="fl jgAttr c-ccc f-fA">
            <i class="c-999 f-fA">{{ question.answerNum }}人回答</i>
          </span>
        </div>
        <el-divider/>

      </div>
      <div class="tac">
        <el-pagination
          v-if="total > limit"
          :current-page="page"
          :page-size="limit"
          :total="total"
          background
          layout="total, prev, pager, next, jumper"
          @current-change="gotoPage" />
      </div>
      <br>
    </div>
  </div>
</template>

<script>
import question from '@/api/qa/question'

export default {
  data() {
    return {
      questionList: [],
      page: 1,
      limit: 6,
      total: 0
    }
  },

  created() {
    // 初始化问题信息
    this.getQuestionList()
  },

  methods: {
    // 获取问题列表信息
    getQuestionList() {
      question.getQuestionList(this.page, this.limit)
        .then(response => {
          console.log(response)
          this.questionList = response.data.data.rows
          this.total = response.data.data.total
        })
    },
    // 分页跳转
    gotoPage(page) {
      question.getQuestionList(page, this.limit)
        .then(response => {
          this.questionList = response.data.data.rows
          this.total = response.data.data.total
        })
    },
    // 跳转到提问页面
    toAsk() {
      window.location.href = '/question/ask'
    }
  }

}
</script>
