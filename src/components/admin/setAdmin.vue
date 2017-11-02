<template>
  <div class="setAdmin">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设置管理员</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="setAdmin-wrapper">
      <el-transfer
        v-model="adminList"
        filterable
        :titles="['普通用户', '管理员']"
        :button-texts="['移除', '添加']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="userList">
      </el-transfer>
    </div>
  </div>
</template>

<script>
  import {getUserAdmin, setAdmin} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  export default {
    data () {
      return {
        adminList: [],
        userList: []
      }
    },
    methods: {
      handleChange (value, direction, movedKeys) {
        setAdmin(movedKeys, direction).then(res => {
          if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      getUserAdmin () {
        getUserAdmin().then(res => {
          if (res.data.error === ERR_OK) {
            this.userList = this.normalizeList(res.data.result)
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      normalizeList (list) {
        let l = []
        this.adminList = []
        list.forEach(item => {
          if (item.role === 1) {
            this.adminList.push(item._id)
          }
          l.push({
            key: item._id,
            label: item.name
          })
        })
        return l
      }
    },
    mounted () {
      this.getUserAdmin()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .setAdmin-wrapper{
    margin-top: 50px;
  }
</style>
