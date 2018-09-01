import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/main/index',
      meta: { title: 'AI雷达' }
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/home/main'),
      children: [{
        path: 'index',
        name: 'index',
        meta: { title: 'AI雷达' },
        component: () => import('@/views/home/index')
      }, {
        path: 'message',
        name: 'message',
        meta: { title: 'AI雷达' },
        component: () => import('@/views/home/message')
      }, {
        path: 'news',
        name: 'news',
        meta: { title: 'AI雷达' },
        component: () => import('@/views/home/news')
      }, {
        path: 'contact',
        name: 'contact',
        meta: { title: 'AI雷达' },
        component: () => import('@/views/home/contact')
      }, {
        path: 'self',
        name: 'self',
        meta: { title: 'AI雷达' },
        component: () => import('@/views/home/self')
      }]
    },
    {
      path: '/produceList',
      name: 'produceList',
      component: () => import('@/views/produce/list')
    },
    {
      path: '/seeCard',
      name: 'seeCard',
      meta: { title: '查看名片' },
      component: () => import('@/views/homeList/seeCard')
    },
    {
      path: '/seeWebsite',
      name: 'seeWebsite',
      meta: { title: '查看网站' },
      component: () => import('@/views/homeList/seeWebsite')
    },
    {
      path: '/callPhone',
      name: 'callPhone',
      meta: { title: '拨打电话' },
      component: () => import('@/views/homeList/callPhone')
    },
    {
      path: '/messageManage',
      name: 'messageManage',
      meta: { title: '销售管家' },
      component: () => import('@/views/messageManage/index')
    }
  ]
})
