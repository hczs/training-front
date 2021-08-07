import axios from 'axios'
import cookie from 'js-cookie'
// eslint-disable-next-line no-unused-vars
import { Message, MessageBox } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 150000 // 请求超时时间
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    // 每次请求把cookie的token放到header中带过去
    if (cookie.get('training_token')) {
      config.headers['token'] = cookie.get('training_token')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
service.interceptors.response.use(
  response => {
    // 响应码401，未登录
    if (response.data.code === 401) {
      MessageBox.confirm(
        response.data.message,
        '您没有登录',
        {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        window.location.href = '/login'
      })
      return
    } else if (response.data.code !== 200) {
      // 弹消息告诉出啥问题了
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error.response) // 返回接口返回的错误信息
  })

export default service
