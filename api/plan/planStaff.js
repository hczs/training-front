import request from '@/utils/request'

const api_name = '/plan/plan-staff'

export default {
  // 获取指定用户的计划信息
  getPlanInfo(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  },

  // 添加计划总结
  addSummary(plan) {
    return request({
      url: `${api_name}/addSummary`,
      method: 'post',
      data: plan
    })
  }
}
