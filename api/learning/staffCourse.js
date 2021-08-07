import request from '@/utils/request'
const api_name = '/learning/staff-course'

export default {

  // 查询员工是否参与了指定课程的学习
  isStudyCourse(courseId, staffId) {
    return request({
      url: `${api_name}/study/${courseId}`,
      method: 'get',
      params: { staffId }
    })
  },

  // 查询我参与的课程
  getMyJoinCourse(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  }

}
