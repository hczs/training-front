<template>
  <div class="bg-fa of" style="height: 100%">
    <div class="mt50 c-infor-box" style="margin-left: 150px; margin-right: 150px; font-size: 20px;">
      我的培训计划
      <el-collapse class="mt20" style="font-size: 15px" accordion>
        <el-collapse-item v-for="item in planList" :key="item.id" :name="item.name" style="font-size: 15px" @click.native="handleClick(item.id)">
          <template slot="title">
            <span style="font-size: 15px; margin-left: 20px">
              {{ item.name }} &nbsp;&nbsp;{{ item.beginTime }}——{{ item.endTime }}
            </span>
          </template>
          <br>
          <div style="font-size: 15px">
            <div style="padding-left: 20px">计划目的：{{ item.purpose }} </div>
            <div class="mt10" style="padding-left: 20px">计划内容：{{ item.content }} </div>
            <div class="mt10" style="padding-left: 20px">计划负责人：{{ item.teacherName }} </div>
            <div class="mt10" style="padding-left: 20px">计划总分数：{{ item.score }} </div>
            <div class="mt10" style="padding-left: 20px">
              我的得分：
              <span v-if="item.staffScore == null"> 暂未评分 </span>
              <span v-else>{{ item.staffScore }}</span>
            </div>
            <div class="mt10" style="padding-left: 20px">请完成以下课程并总结（点击课程名称进入学习页面）</div>
            <el-divider/>
            <div style="width: 100%; padding-left: 20px" class="mt20">
              <div v-for="course in courseList" :key="course.id" class="mt20">
                <a :href="'/course/'+course.id"> {{ course.title }} </a>
                <br>
              </div>
            </div>
            <el-divider/>
            <div class="mt10" style="float: right">
              <el-button v-if="item.summary != null" type="success" size="small" @click="getPlanSummary(item.id, item.summary)"> 已总结，点击修改 </el-button>
              <el-button v-else type="success" size="small" @click="getPlanSummary(item.id, item.summary)"> 计划总结 </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
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
      <!-- 表单对话框 -->
      <el-dialog :visible.sync="dialogFormVisible" title="计划总结">
        <el-form :model="plan">
          <el-form-item label-width="120px" label="计划总结">
            <el-input v-model="plan.summary" type="textarea" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitSummary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import planStaff from '@/api/plan/planStaff'
import planCourse from '@/api/plan/planCourse'

export default {
  data() {
    return {
      page: 1,
      limit: 8,
      total: 0,
      planList: [],
      courseList: [],
      planDisabled: true,
      dialogFormVisible: false,
      plan: {
        id: '',
        summary: ''
      }
    }
  },
  mounted() {
    // 初始化计划list
    setTimeout(() => { // 设置延迟执行
      this.initPlanList()
    }, 500)
  },
  methods: {
    // 初始化计划列表
    initPlanList() {
      planStaff.getPlanInfo(this.page, this.limit)
        .then(response => {
          this.planList = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 计划翻页请求数据
    gotoPage(page) {
      planStaff.getPlanInfo(page, this.limit)
        .then(response => {
          this.planList = response.data.data.rows
          this.total = response.data.data.total
        })
    },

    // 点击获取培训计划下的课程信息
    handleClick(id) {
      // 更新正在操作的计划id
      this.plan.id = id
      // 获取课程信息
      planCourse.getCourseList(id)
        .then(response => {
          this.courseList = response.data.data.courses
        })
    },

    // 回显计划信息
    getPlanSummary(id, summary) {
      this.dialogFormVisible = true
      this.plan.id = id
      this.plan.summary = summary
    },

    // 提交总结
    submitSummary() {
      // 关闭弹框
      this.dialogFormVisible = false
      console.log(this.plan)
      planStaff.addSummary(this.plan)
        .then(response => {
          this.$message({
            message: '提交成功!',
            type: 'success'
          })
          // 更新计划信息
          this.initPlanList()
        })
    }
  }
}
</script>
