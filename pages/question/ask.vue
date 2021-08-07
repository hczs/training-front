<template>
  <div style="height: 600px" class="bg-fa of">
    <div class="mt20 c-infor-box" style="margin-left: 150px; margin-right: 150px">
      <div class="tac">
        <h2>提问题</h2>
        <el-button style="float: right" type="success" round @click="askQuestion">
          发布问题
        </el-button>
      </div>
      <br>
      <br>
      <br>

      <el-input v-model="question.title" maxlength="30" show-word-limit placeholder="请输入问题标题，以问号结尾，最多三十个字别多填了"/>
      <section class="container">
        <div
          v-quill:myQuillEditor="editorOption"
          :content="question.content"
          class="quill-editor"
          @change="onEditorChange($event)"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)"/>
      </section>
    </div>
  </div>
</template>

<script>
import question from '@/api/qa/question'

export default {
  data() {
    return {
      question: {
        title: '',
        content: ''
      },
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

  methods: {
    // 提问题
    askQuestion() {
      console.log(this.question)
      question.addQuestion(this.question)
        .then(response => {
          if (response.data.code === 200) {
            // 提示提问成功
            this.$message({
              type: 'success',
              message: '发布问题成功！'
            })
            // 跳转页面
            window.location.href = '/question'
          }
        })
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
      this.question.content = html
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
      min-height: 600px;
      max-height: 600px;
      overflow-y: auto;
    }
  }
</style>
