import request from '@/utils/request'

// 初始化获取列表
export function init_list (data) {
  return request({
    url: '/api/Dynamic/index',
    method: 'get',
    params: data
  })
}

// 点赞
export function click_good (data) {
  return request({
    url: '/api/dynamic/praise',
    method: 'get',
    params: data
  })
}

export function to_comment (data) {
  return request({
    url: '/api/comment/save',
    method: 'post',
    data: data
  })
}

// 发布
export function to_release (data) {
  return request({
    url: '/api/dynamic/save',
    method: 'post',
    data: data
  })
}

//公司详情
export function to_companyDetails (data) {
    return request({
        url: '/api/Dynamic/read',
        method: 'get',
        params: data
    })
}