import request from '@/utils/request'
const api_name = '/learning/staff-video'

export default {

  // 记录总学习时长
  recordAllTime(videoId, allTime) {
    return request({
      url: `${api_name}/reocrd/${videoId}`,
      method: 'get',
      params: { allTime }
    })
  },

  // 记录小节观看记录（播放位置）
  lastVideoTime(videoId, lastTime) {
    return request({
      url: `${api_name}/last/${videoId}`,
      method: 'get',
      params: { lastTime }
    })
  },

  // 获取上次播放进度
  getLastTime(videoId) {
    return request({
      url: `${api_name}/progress/${videoId}`,
      method: 'get'
    })
  },

  // 获取指定职工学习总时长
  getLearningTime(staffId) {
    return request({
      url: `${api_name}/time/${staffId}`,
      method: 'get'
    })
  },

  // 观看完成小节之后设置小节观看完成标记
  accomplishVideo(courseId, videoId) {
    return request({
      url: `${api_name}/accomplish/${courseId}/${videoId}`,
      method: 'get'
    })
  }

}
