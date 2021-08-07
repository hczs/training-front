import request from '@/utils/request'

const api_name = '/ucenter'

export default {
  // 根据邮箱发送验证码
  getCode(mail) {
    return request({
      url: `${api_name}/send/${mail}`,
      method: 'get'
    })
  },

  // 用户注册
  submitRegister(formItem) {
    return request({
      url: `${api_name}/register`,
      method: 'post',
      data: formItem
    })
  }
}
