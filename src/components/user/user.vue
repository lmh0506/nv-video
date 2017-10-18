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
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        router: true
      }
    },
    computed: {
      ...mapState([
        'user'
      ]),
      activeRoute () {
        this.$nextTick(() => {
          return this.$route.path
        })
      }
    },
    methods: {
      routerIndex (index) {
        switch (index) {
          case 0: return `/user/${this.user.id}/`
          case 1: return `/user/${this.user.id}/video`
          case 2: return `/user/${this.user.id}/favorites`
          case 3: return `/user/${this.user.id}/setting`
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .user-wrapper{
    width: 1100px;
    margin: 0px auto;
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
