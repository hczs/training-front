import request from '@/utils/request'

const api_name = '/qa/question'

export default {
  // 提问（添加问题）
  addQuestion(question) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: question
    })
  },

  // 查询我的提问
  myQuestion(page, limit) {
    return request({
      url: `${api_name}/my-question/${page}/${limit}`,
      method: 'get'
    })
  },

  // 获取问题详情信息
  getQuestionInfo(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },

  // 分页查询问题列表，更新时间倒序
  getQuestionList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  }
}
