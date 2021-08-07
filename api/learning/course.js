import request from '@/utils/request'
const api_name = 'learning/front/course'
export default {
  // 分页查询带条件
  getPageList(page, limit, courseQuery) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },

  // 查询热门课程
  getHotCourses() {
    return request({
      url: `${api_name}/hot`,
      method: 'get'
    })
  },

  // 查询课程详情信息和章节信息
  getCourseInfo(courseId) {
    return request({
      url: `${api_name}/${courseId}`,
      method: 'get'
    })
  },

  // 参与课程
  joinCourse(courseId) {
    return request({
      url: `${api_name}/join/${courseId}`,
      method: 'get'
    })
  }
}
