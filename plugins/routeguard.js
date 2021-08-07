import cookie from 'js-cookie'

export default ({ app }) => {
  app.router.beforeEach(async(to, from, next) => {
    var toPath = to.path
    console.log('to：', to.path)
    console.log('from', from.path)
    // 如果访问课程学习页面的话就得验证是否登录了
    if (toPath.indexOf('/course/study') !== -1) {
      console.log('拦截路径')
      // 验证是否登录，就事看看cookie里面有没有用户的token
      var jsonStr = cookie.get('training_userInfo')
      if (jsonStr == null && jsonStr === 'undefined' && jsonStr === '') {
        console.log('拦截了，准备跳转登录页面！')
        // 未登录就拦截
        next('/login')
      }
    }
    next()
  })
}
