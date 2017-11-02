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
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuye"></use>
                </svg>
                <span slot="title">首页</span>
              </el-menu-item>
              <el-menu-item index="/admin/userList">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yonghuquntiliebiao"></use>
                </svg>
                <span slot="title">用户列表</span>
              </el-menu-item>
              <el-menu-item index="/admin/setAdmin">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-guanliyuanzhanghaoshezhi"></use>
                </svg>
                <span slot="title">设置管理员</span>
              </el-menu-item>
              <el-submenu index=''>
                <template slot="title">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-duanshipinzhihangguanli"></use>
                  </svg>
                  <span>视频管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/admin/videoType">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-ClassificationManagement"></use>
                    </svg>
                    类型管理
                  </el-menu-item>
                  <el-menu-item index="/admin/videoAudit">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shipin-shenhezhong"></use>
                    </svg>
                    视频审核
                  </el-menu-item>
                  <el-menu-item index="/admin/videoList">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-shipinliebiao"></use>
                    </svg>
                    视频列表
                  </el-menu-item>
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
  import {isAdmin} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'

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
    },
    beforeRouteEnter (to, from, next) {
      isAdmin().then(res => {
        if (res.data.error === ERR_OK) {
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
