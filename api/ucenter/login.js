import request from '@/utils/request'

const api_name = '/ucenter'

export default {
  // 获取用户信息
  getLoginInfo() {
    return request({
      url: `${api_name}/info`,
      method: 'get'
    })
  },
  // 用户登录
  submitLogin(formItem) {
    return request({
      url: `${api_name}/login`,
      method: 'post',
      data: formItem
    })
  }
}
