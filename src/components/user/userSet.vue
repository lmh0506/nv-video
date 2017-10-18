<template>
  <div class="userSet-wrapper">
    <div class="user-set">
      <h3 class="user-set-title">用户信息设置</h3>
      <div class="user-set-content">
        <el-form class="user-set-form" label-width="80px" :model="userForm" :rules="rules">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="userForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item class="save-btn">
            <el-button type="primary" @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getUser, saveUser} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {_checkName, _checkEmail, _checkPhone} from '@/util/check'

  export default {
    data () {
      return {
        userForm: {
          name: '',
          phone: '',
          email: ''
        },
        rules: {
          name: [
            {validator: _checkName, trigger: 'blur'}
          ],
          email: [
            {validator: _checkEmail(true), trigger: 'blur'}
          ],
          phone: [
            {validator: _checkPhone, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState([
        'user'
      ])
    },
    methods: {
      getUser () { // 获取用户数据
        if (this.user.id) {
          getUser(this.user.id).then(res => {
            if (res.data.error === ERR_OK) {
              this.userForm = res.data.result
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            }
          })
        }
      },
      save () { // 保存用户信息
        saveUser(this.user.id, this.userForm).then(res => {
          if (res.data.error === ERR_OK) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      }
    },
    mounted () {
      this.getUser()
    },
    watch: {
      user () { // user的值更新后再 进行获取用户信息  避免直接刷新获取不到值
        this.getUser()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .user-set{
    padding: 10px;

    .user-set-title{
      margin-bottom: 30px;
    }

    .user-set-content{
      .user-set-form {
        width: 300px;
        margin: 0px auto;

        .save-btn{
          text-align: center;
        }
      }
    }
  }
</style>
