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
        <router-link tag="div" :to="{name:'user', params: { id: 123 }}">个人中心</router-link>
      </el-menu-item>
      <li class='login-info'>
        <div class='item' v-show='isLogin'>
          <img src='../assets/logo.png'>
        </div>
        <div class='item' v-show='isLogin'>
          lmh
        </div>
        <div class='item' v-show='!isLogin'>
          <router-link to='/login'>登录</router-link>
        </div>
        <div class='item' v-show='!isLogin'>
          <router-link to='/registe'>注册</router-link>
        </div>
        <div class='item' v-show='isLogin'>
          退出
        </div>
      </li>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLogin: false
    }
  },
  computed: {
    activeIndex () {
      // 通过路由的名称判断当前导航位置
      switch (this.$route.name) {
        case 'Index': return '1'
        case 'rankList': return '2'
        case 'user': return '3'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
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
        padding: 5px 20px;
      }
    }
  }
</style>
