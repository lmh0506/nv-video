<template>
  <div class="user-wrapper">
    <div class="user-banner">
      <div class="user-info">
        <img  class="user-avatar" v-lazy="avatarSrc" alt="" width="100" height="100">
        <div class="user-name">
          {{owner.name}}
        </div>
      </div>
    </div>
    <el-menu :default-active="activeRoute" class="el-menu-demo" mode="horizontal" :router = "router" >
      <el-menu-item :index="routerIndex(0)">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuye"></use>
        </svg>
        主页
      </el-menu-item>
      <el-menu-item :index="routerIndex(1)">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bofang"></use>
        </svg>
        视频
      </el-menu-item>
      <el-menu-item :index="routerIndex(2)">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucang1"></use>
        </svg>
        收藏夹
      </el-menu-item>
      <el-menu-item :index="routerIndex(3)" v-if="isVisiter">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shezhi"></use>
        </svg>
        设置
      </el-menu-item>
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
        router: true,
        owner: {}
      }
    },
    computed: {
      activeRoute () {
        return this.$route.path
      },
      isVisiter () {
        return this.user.id === this.$route.params.id
      },
      ...mapState([
        'user'
      ]),
      avatarSrc () {
        return this.user.id === this.owner.id ? this.user.avatar ? this.user.avatar : this.owner.avatar : this.owner.avatar
      }
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
    watch: {
      '$route' (to, from) {
        if (to.params.id !== from.params.id) {
          checkExist({'id': to.params.id}).then(res => {
            if (res.data.error === 10001) {
              this.owner = res.data.result
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            } else {
              this.$router.push('/404')
            }
          })
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      checkExist({'id': to.params.id}).then(res => {
        if (res.data.error === 10001) {
          next(vm => {
            vm.owner = res.data.result
          })
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
