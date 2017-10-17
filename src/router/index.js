import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import rankList from '@/components/rankList'
import user from '@/components/user'
import login from '@/components/login'
import registe from '@/components/registe'
import admin from '@/components/admin'
import userList from '@/components/userList'
import videoType from '@/components/videoType'
import adminIndex from '@/components/adminIndex'
import forgetPwd from '@/components/forgetPwd'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/rankList',
      name: 'rankList',
      component: rankList
    },
    {
      path: '/user/:id',
      name: 'user',
      component: user
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/registe',
      name: 'registe',
      component: registe
    },
    {
      path: '/forgetPwd',
      name: 'forgetPwd',
      component: forgetPwd
    },
    {
      path: '/admin',
      component: admin,
      children: [
        {
          path: '/',
          name: 'adminIndex',
          component: adminIndex
        },
        {
          path: 'userList',
          name: 'userList',
          component: userList
        },
        {
          path: 'videoType',
          name: 'videoType',
          component: videoType
        }
      ]
    }
  ]
})
