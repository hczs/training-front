import request from '@/utils/request'

const api_name = '/learning/course-comment'

export default {

  getPageList(page, limit, courseId) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: { courseId }
    })
  },
  addComment(comment) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: comment
    })
  }

}
