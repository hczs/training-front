import request from '@/utils/request'
const api_name = 'home/banner'
export default {
  // 获取bannerList
  getList() {
    return request({
      url: `${api_name}/all`,
      method: 'get'
    })
  }
}
