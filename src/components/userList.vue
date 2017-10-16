<template>
  <div class="userList-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchKey" placeholder="查找用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
    v-loading='loading'
    element-loading-text="拼命加载中"
    :data="userList"
    style="width: 100%"
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
          
          <el-dialog title="修改用户信息" :visible.sync="editUser">
            <el-form :label-width="formLabelWidth" :model="userForm" status-icon :rules='rules'>
              <el-form-item label="用户名" prop='userName'>
                <el-input v-model="userForm.userName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="昵称" prop='name'>
                <el-input v-model="userForm.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱地址" prop='email'>
                <el-input v-model="userForm.email" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop='phone'>
                <el-input v-model="userForm.phone" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editUser = false">取 消</el-button>
              <el-button type="primary" @click="update()">确 定</el-button>
            </div>
          </el-dialog>

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
  import {getUserList, deleteUser, updateUser} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {_checkUserName, _checkName, _checkEmail, _checkPhone} from '@/util/check'

  export default {
    data () {
      return {
        userList: [], // 用户列表数据
        pageSize: 10, // 每页显示数目
        total: 0, // 总数
        currentPage: 1, // 当前页码
        searchKey: '', // 查询的关键字
        loading: false, // 是否显示loading
        editUser: false, // 是否显示编辑用户的模态框
        formLabelWidth: '80px', // label标签宽度
        userForm: {
          userName: '',
          name: '',
          email: '',
          phone: ''
        }, // 用户表单
        rules: {
          userName: [
            {validator: _checkUserName(true), trigger: 'blur'}
          ],
          name: [
            {validator: _checkName, trigger: 'blur'}
          ],
          email: [
            {validator: _checkEmail, trigger: 'blur'}
          ],
          phone: [
            {validator: _checkPhone, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getUserList () {
        this.loading = true
        getUserList(this.searchKey, this.currentPage, this.pageSize).then(res => { // 获取用户列表
          if (res.data.error === ERR_OK) {
            this.userList = this.normalizeList(res.data.result)
            this.total = res.data.total
            this.loading = false
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
      handleEdit (index, id) {
        let user = this.userList[index]
        this.userForm = user
        this.editUser = true
      },
      handleCurrentChange (page) { // 跳转页码
        this.currentPage = page
        this.getUserList()
      },
      search () { // 搜索
        this.getUserList()
      },
      update () {
        updateUser(this.userForm).then(res => {
          if (res.data.error === ERR_OK) {
            this.editUser = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
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
