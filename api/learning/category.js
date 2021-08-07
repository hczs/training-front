import request from '@/utils/request'

const api_name = '/learning/course-category'

export default {

  // 查询分类数据
  getTreeList() {
    return request({
      url: `${api_name}/treeList`,
      method: 'get'
    })
  }

}
