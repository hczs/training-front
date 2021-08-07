<template>
  <div class="bg-fa of">
    <div class="mt50 c-infor-box" style="margin-left: 150px; margin-right: 150px">
      <el-button style="float: right" size="small" type="success" round @click="toQuestion">返回问答列表</el-button>
      <el-divider/>

      <!-- 问题标题 -->
      <h2>{{ question.title }}</h2>
      <br>
      <!-- 头像和id -->
      <div
        style="float: left; display: flex; align-items:center;"
        class="tac">
        <img :src="question.avatar" style="border-radius:50%" width="30px" height="30px" class="picImg">
        <span class="fsize12" style="margin-left: 10px">{{ question.username }}</span>
      </div>
      <br>
      <br>
      <br>
      <!-- 问题描述 -->
      <div class="ql-container ql-snow">
        <div class="ql-editor" style="font-size: 15px" v-html="question.content"/>
      </div>
      <div class="of mt5">
        <span class="fr"><font class="fsize12 c-999 ml5">{{ question.createTime }}</font></span>
      </div>
      <el-divider/>
      <br>
      <!-- 问题回答 -->
      <section class="question-list lh-bj-list pr">
        <ul class="pr10">
          <li v-for="answer in answerList" :key="answer.id">
            <aside class="noter-pic">
              <img :src="answer.avatar" width="50" height="50" class="picImg">
            </aside>
            <div class="of">
              <span class="fl">
                <font class="fsize12 c-blue">
                  {{ answer.username }}</font>
              <font class="fsize12 c-999 ml5">回答：</font></span>
            </div>
            <div class="ql-container ql-snow">
              <div style="font-size: 15px" class="ql-editor mt5" v-html="answer.content"/>
            </div>
            <div class="of mt5">
              <a href=" javascript:void(0);" @click="openReplyDialog(answer.id, answer.id, answer.username)">回复</a>
              <span class="fr"><font class="fsize12 c-999 ml5">{{ answer.createTime }}</font></span>
            </div>
            <el-divider/>
            <!-- 楼中楼回复 -->
            <div v-if="answer.children.length != 0">
              <div v-for="children in answer.children" :key="children.id">
                <!-- 楼中楼头像和id -->
                <div style="float: left; display: flex; align-items:center;">
                  <img :src="children.avatar" style="border-radius:50%" width="20px" height="20px" class="picImg">
                  <span class="fsize12" style="margin-left: 10px">
                    <span class="c-blue">{{ children.username }}</span>
                    <span v-if="children.replyName != null" class="fsize12">回复
                      <span class="c-blue">{{ children.replyName }}</span>：
                    </span>
                    <span v-else>评论：</span>
                  </span>
                </div>
                <!-- 回复内容 -->
                <div v-html="children.content"/>
                <div class="of mt5">
                  <a href=" javascript:void(0);" @click="openReplyDialog(answer.id, children.id, children.username)">回复</a>
                  <span class="fr"><font class="fsize12 c-999 ml5">{{ children.createTime }}</font></span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
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
      <!-- 底部回答栏 -->
      <section class="container">
        <div
          v-quill:myQuillEditor="editorOption"
          :content="answer.content"
          class="quill-editor"
          @change="onEditorChange($event)"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"/>
        <br>
        <el-button style="float: right" type="success" size="medium" round @click="addAnswer">发布回答</el-button>
      </section>
      <!-- 弹框回复消息 -->
      <el-dialog :visible.sync="dialogFormVisible" :title="'回复给：' + replyName">
        <el-form>
          <el-form-item label="回复内容">
            <el-input v-model="dialogContent" type="textarea" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelReply">取 消</el-button>
          <el-button type="primary" @click="addAnswer">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import question from '@/api/qa/question'
import answer from '@/api/qa/answer'

export default {
  asyncData({ params, error }) {
    return { questionId: params.id }
  },
  data() {
    return {
      question: {}, // 当前问题信息
      questionId: '', // 当前问题id
      answer: {
        questionId: '', // 当前回复的问题id
        content: '', // 当前评论内容
        replyId: '0', // 当前要回复的评论id，默认0
        parentId: '0' // 当前是在哪个评论下回复的id，默认0
      }, // 回答对象
      page: 1,
      limit: 6,
      total: 0,
      replyName: '', // 当前回复的用户名称
      dialogFormVisible: false, // 回复弹框控制
      dialogContent: '', // 弹框中内容
      answerList: [],
      editorOption: {
        // some quill options
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block']
          ]
        }
      }
    }
  },

  created() {
    // 获取问题详情
    this.getQuestionInfo()
    // 获取问题回答信息
    this.getAnswerList()
  },

  methods: {
    // 获取问题详情信息
    getQuestionInfo() {
      question.getQuestionInfo(this.questionId)
        .then(response => {
          console.log(response)
          this.question = response.data.data.question
        })
    },

    // 获取回答数据列表
    getAnswerList() {
      answer.getAnswerList(this.page, this.limit, this.questionId)
        .then(response => {
          console.log(response)
          this.answerList = response.data.data.treeAnswer
          this.total = response.data.data.total
        })
    },

    // 分页获取回答数据列表
    gotoPage(page) {
      this.page = page
      answer.getAnswerList(page, this.limit, this.questionId)
        .then(response => {
          this.answerList = response.data.data.treeAnswer
          this.total = response.data.data.total
        })
    },

    // 发布回答
    addAnswer() {
      // 设置是回答的哪个问题，赋值id
      this.answer.questionId = this.questionId
      // 如果打开弹框的话就把弹框内写的内容赋值上来
      if (this.dialogFormVisible === true) {
        this.answer.content = this.dialogContent
      }
      console.log(this.answer)
      answer.addAnswer(this.answer)
        .then(response => {
          console.log(response)
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '发布回答成功！'
            })
          }
          // 刷新页面数据，关闭弹框
          this.answer = {}
          this.getAnswerList()
          this.dialogFormVisible = false
        })
    },

    // 打开回复框
    openReplyDialog(parentId, replyId, replyName) {
      this.answer.questionId = this.questionId
      this.answer.parentId = parentId
      this.answer.replyId = replyId
      this.replyName = replyName
      // 清空上次输入的数据
      this.dialogContent = ''
      // 打开弹框
      this.dialogFormVisible = true
    },

    // 点击取消后关闭弹框
    cancelReply() {
      this.answer = {}
      this.dialogFormVisible = false
    },

    // 返回问答页面
    toQuestion() {
      window.location.href = '/question'
    },

    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      console.log('editor change!', editor, html, text)
      this.answer.content = html
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 50px 0;
    .quill-editor {
      min-height: 300px;
      max-height: 300px;
      overflow-y: auto;
    }
  }
</style>
