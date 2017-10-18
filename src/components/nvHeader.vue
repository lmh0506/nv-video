<template>
  <div class="nv-header">
    <el-menu :default-active='activeIndex' class='el-menu-demo' mode='horizontal'>
      <li class='logo'>
        <router-link to='/'>
          <img src='../assets/logo.png' />
        </router-link>
      </li>
      <el-menu-item index='1'>
        <router-link tag="div" to='/'>首页</router-link>
      </el-menu-item>
      <el-menu-item index='2'>
        <router-link tag="div" to='/rankList'>排行榜</router-link>
      </el-menu-item>
      <el-menu-item index='3'>
        <router-link tag="div" :to="personRoute">个人中心</router-link>
      </el-menu-item>
      <li class='login-info'>
        <router-link tag="div" class='item' v-if='isLogin' :to="{name:'userIndex', params: { id: user.id }}">
          <img class="avatar" height="50" :src='user.avatar'>
        </router-link>
        <router-link tag="div" class='item' v-if='isLogin' :to="{name:'userIndex', params: { id: user.id }}">
          {{user.name}}
        </router-link>
        <router-link tag="div" class='item' v-if='!isLogin' to='/login'>登录</router-link>
        <router-link class='item' v-if='!isLogin' to='/registe'>注册</router-link>
        <div class='item' v-if='isLogin' @click="loginOut">
          退出
        </div>
      </li>
    </el-menu>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {checkLogin, loginOut} from '@/api/User'
  import {ERR_OK} from '@/config/index'

  export default {
    computed: {
      activeIndex () {
        // 通过路由的名称判断当前导航位置
        switch (this.$route.name) {
          case 'Index': return '1'
          case 'rankList': return '2'
          case 'user': return '3'
        }
      },
      personRoute () {
        return this.isLogin ? {name: 'userIndex', params: { id: this.user.id }} : '/login'
      },
      isLogin () {
        if (this.user.id) {
          return true
        } else {
          return false
        }
      },
      ...mapState([
        'user'
      ])
    },
    methods: {
      ...mapMutations([
        'updateUser'
      ]),
      loginOut () { // 退出登录
        loginOut().then(res => {
          if (res.data.error === ERR_OK) {
            this.updateUser({})
          }
        })
      }
    },
    mounted () {
      // 获取登录的用户信息并存储到vuex中
      if (!this.isLogin) {
        checkLogin().then(res => {
          if (res.data.error === ERR_OK) {
            this.updateUser(res.data.result)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  :focus{
    outline: none;
  }
  .nv-header{
    li.logo {
      float: left;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      font-size: 14px;
      padding: 5px 20px;
    }
    li.login-info{
      float: right;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
      font-size: 14px;
      width: 250px;

      .item {
        float: left;
        cursor: pointer;
        padding: 0px 20px;

        .avatar{
          padding-top: 5px;
          border-radius: 50%;
        }
      }

      .item:hover{
        color: #409EFF;
      }
    }
  }
</style>
