<template>
  <el-container class="admin-wrapper">
    <el-aside width='200px' class="admin-aside">
      <el-row class="admin-main">
        <el-col :span="24">
          <div class="admin-menu">
            <el-menu
              :default-active="activeRoute"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router = "router">
              <el-menu-item index="/admin/">
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
              </el-menu-item>
              <el-menu-item index="/admin/userList">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
              </el-menu-item>
              <el-submenu index=''>
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span>视频管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/admin/videoType">类型管理</el-menu-item>
                  <el-menu-item index="/admin/videoAudit">视频审核</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-col>
      </el-row>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    data () {
      return {
        router: true
      }
    },
    computed: {
      activeRoute () {
        return this.$route.path
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .admin-wrapper {
    min-height: calc(100% - 162px);
    position: relative;
    .admin-aside{
      padding-top: 30px;
      background-color: #545c64;

      .el-menu{
        border: none;
      }
    }
  }
</style>
