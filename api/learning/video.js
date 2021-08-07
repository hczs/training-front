import request from '@/utils/request'
const api_name = '/learning/video'

export default {

  // 获取小节视频播放凭证
  getPlayAuth(vid) {
    return request({
      url: `${api_name}/playAuth/${vid}`,
      method: 'get'
    })
  }

}
