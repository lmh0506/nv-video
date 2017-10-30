import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/Index'
import rankList from '@/components/rank/rankList'
import user from '@/components/user/user'
import login from '@/components/login/login'
import registe from '@/components/registe/registe'
import admin from '@/components/admin/admin'
import userList from '@/components/admin/userList'
import videoType from '@/components/admin/videoType'
import videoAudit from '@/components/admin/videoAudit'
import videoList from '@/components/admin/videoList'
import adminIndex from '@/components/admin/adminIndex'
import forgetPwd from '@/components/forgetPwd/forgetPwd'
import userIndex from '@/components/user/userIndex'
import userVideo from '@/components/user/userVideo'
import userStore from '@/components/user/userStore'
import userSet from '@/components/user/userSet'
import videoDetail from '@/components/video/videoDetail'
import search from '@/components/search/search'
import typeDetail from '@/components/typeDetail/typeDetail'

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
      component: user,
      children: [
        {
          path: '/',
          name: 'userIndex',
          component: userIndex
        },
        {
          path: 'video',
          name: 'userVideo',
          component: userVideo
        },
        {
          path: 'favorites',
          name: 'userStore',
          component: userStore
        },
        {
          path: 'setting',
          name: 'userSet',
          component: userSet
        }
      ]
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
      path: '/search',
      name: 'search',
      component: search
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
        },
        {
          path: 'videoAudit',
          name: 'videoAudit',
          component: videoAudit
        },
        {
          path: 'videoList',
          name: 'videoList',
          component: videoList
        }
      ]
    },
    {
      path: '/video/:id',
      name: 'videoDetail',
      component: videoDetail
    },
    {
      path: '/type/:id',
      name: 'typeDetail',
      component: typeDetail
    }
  ]
})
