import request from '@/utils/request'

export function customerList (data) {
  // 客户列表
  return request({
    url: '/api/Customer/index',
    method: 'get',
    params: data
  })
}

export function customerTagList () {
  // 客户标签列表
  return request({
    url: '/api/Customertag/tagList',
    method: 'get'
  })
}

export function insertCustomerTag (data) {
  // 新增客户标签
  return request({
    url: '/api/Customertag/save',
    method: 'post',
    data: data
  })
}

export function getCustomerTagEdit (data) {
  // 查看客户标签详情
  return request({
    url: '/api/Customertag/edit',
    method: 'get',
    params: data
  })
}

export function updateCustomerTag (data) {
  // 更新客户标签详情
  return request({
    url: '/api/Customertag/update',
    method: 'POST',
    data: data
  })
}

export function deleteCustomerTag (data) {
  // 标签删除客户
  return request({
    url: '/api/Customertag/delete',
    method: 'POST',
    data: data
  })
}
