import request from '@/utils/request'

const api_name = '/plan/plan-course'

export default {
  // 获取指定计划下的课程信息
  getCourseList(planId) {
    return request({
      url: `${api_name}/courses/${planId}`,
      method: 'get'
    })
  }
}
