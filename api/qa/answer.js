import request from '@/utils/request'

const api_name = '/qa/answer'

export default {
  // 回答（添加回答）
  addAnswer(answer) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: answer
    })
  },

  // 分页查询回答列表
  getAnswerList(page, limit, questionId) {
    return request({
      url: `${api_name}/${page}/${limit}/${questionId}`,
      method: 'get'
    })
  },

  // 获取指定员工回答过的问题
  getMyAnswer(page, limit, staffId) {
    return request({
      url: `${api_name}/staff/${page}/${limit}`,
      method: 'get',
      params: { staffId: staffId }
    })
  }
}
