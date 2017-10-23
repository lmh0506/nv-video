<template>
  <div class="user-wrapper">
    <div class="user-banner">
      <div class="user-info">
        <img  class="user-avatar" :src="user.avatar" alt="" width="100" height="100">
        <div class="user-name">
          {{user.name}}
        </div>
      </div>
    </div>
    <el-menu :default-active="activeRoute" class="el-menu-demo" mode="horizontal" :router = "router" >
      <el-menu-item :index="routerIndex(0)">主页</el-menu-item>
      <el-menu-item :index="routerIndex(1)">视频</el-menu-item>
      <el-menu-item :index="routerIndex(2)">收藏夹</el-menu-item>
      <el-menu-item :index="routerIndex(3)">设置</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import {checkExist} from '@/api/User'
  import {NO_LOGIN} from '@/config/index'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        router: true
      }
    },
    computed: {
      activeRoute () {
        return this.$route.path
      },
      ...mapState([
        'user'
      ])
    },
    methods: {
      routerIndex (index) {
        let id = this.$route.params.id
        switch (index) {
          case 0: return `/user/${id}/`
          case 1: return `/user/${id}/video`
          case 2: return `/user/${id}/favorites`
          case 3: return `/user/${id}/setting`
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      checkExist({'id': to.params.id}).then(res => {
        if (res.data.error === 10001) {
          next()
        } else if (res.data.error === NO_LOGIN) {
          next('/login')
        } else {
          next('/404')
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .user-wrapper{
    width: 1100px;
    margin: 0px auto;
    position: relative;
    min-height: calc(100% - 162px);

    .user-banner{
      height: 200px;
      background: url(../../assets/user_bg.jpg) no-repeat top center;
      background-size: 100% 100%;
      overflow: hidden;

      .user-info{
        margin-top: 20px;
        text-align: center;

        .user-avatar{
          border-radius: 50%;
          margin-bottom: 10px;
        }
        .user-name {
          font-size: 28px;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
</style>
