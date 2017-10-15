<template>
  <div class="userList-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="userName" placeholder="查找用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="userList"
    style="width: 100%"
    :default-sort = "{prop: 'id', order: 'descending'}"
    class="userList-table"
    >
      <el-table-column
        prop="userName"
        label="用户名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row.id)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getUserList, deleteUser} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'

  export default {
    data () {
      return {
        userList: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        searchKey: {},
        userName: ''
      }
    },
    methods: {
      getUserList () {
        getUserList(this.searchKey, this.currentPage, this.pageSize).then(res => { // 获取用户列表
          if (res.data.error === ERR_OK) {
            this.userList = this.normalizeList(res.data.result)
            this.total = res.data.total
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      normalizeList (list) { // 格式化用户列表
        list.forEach(item => {
          if (item.phone === '') {
            item.phone = '暂无'
          }
        })
        return list
      },
      handleDelete (index, id) { // 删除用户
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(res => {
            if (res.data.error === ERR_OK) {
              this.userList.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getUserList()
      },
      search () {
        this.searchKey = {userName: this.userName}
        this.getUserList()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getUserList()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .demo-form-inline{
    margin-top: 15px;
  }
  .userList-table{
    margin-bottom: 20px;
  }
  .block {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    .el-pagination{
      text-align: center;
    }
  }
</style>
