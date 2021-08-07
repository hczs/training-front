import request from '@/utils/request'

const api_name = '/ucenter/staff'

export default {

  // 更新用户基本信息
  updateUserInfo(formItem) {
    return request({
      url: `${api_name}/info`,
      method: 'post',
      data: formItem
    })
  },

  // 更新密码
  updatePassword(passwordVo) {
    return request({
      url: `${api_name}/pwd`,
      method: 'post',
      data: passwordVo
    })
  }
}
