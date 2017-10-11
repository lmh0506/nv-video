import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import rankList from '@/components/rankList'
import user from '@/components/user'
import login from '@/components/login'
import registe from '@/components/registe'

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
    }
  ]
})
