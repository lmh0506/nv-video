<template>
  <div class='login-wrapper'>
    <div class="login-form">
      <h1 class="form-title">登录</h1>
      <el-form :model="ruleForm" status-icon :rules='rules' ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" :error='errorMsg' prop="passWord">
          <el-input type="password" v-model="ruleForm.passWord"></el-input>
        </el-form-item>
        <el-form-item prop="yzm">
          <yzm @draw = 'draw'></yzm>
          <el-input v-model="ruleForm.yzm" @keyup.native.enter="login" class="yzm-input"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" style="padding:12px 32px"  @click="login">登录</el-button>
          <el-button>          
            <router-link to="/registe">快速注册</router-link>
          </el-button>
        </el-form-item>
        <p class="forgetPwd"><router-link to="/forgetPwd">忘记密码?</router-link></p>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {baseFormMixin} from '@/mixins/baseFormMixin'
  import {loginUser} from '@/api/User'
  import {ERR_OK} from '@/config/index'
  import {_checkUserName} from '@/util/check'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [baseFormMixin],
    data () {
      return {
        rules: {
          userName: [
            {validator: _checkUserName(false), trigger: 'blur'}
          ]
        },
        errorMsg: '' // 显示密码错误信息  用于登录时密码错误的情况
      }
    },
    methods: {
      ...mapMutations([
        'updateUser'
      ]),
      login () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            loginUser(this.ruleForm).then(res => {
              if (res.data.error === ERR_OK) {
                this.errorMsg = ''
                this.updateUser(res.data.result)
                this.$router.back()
              } else if (res.data.error === 10001) {
                this.errorMsg = '密码错误'
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .login-wrapper{
    width: 100%;
    min-height: calc(100% - 162px); 
    background: url('../../assets/login.jpg') no-repeat center;
    background-size: 100% auto;
    background-position-y: 20%;
    background-color: #ddd;

    .login-form {
      width: 350px;
      padding: 10px 30px 10px 0;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 7px 7px 5px #bbb;
      position: absolute;
      top: 20%;
      right: 15%;

      .form-title{
        text-align: center;
        margin-left: 30px;
        margin-bottom: 15px;
      }

      .yzm-input{
        width: 170px;
        float: left;
        margin-right: 20px;
      }

      .login-btn{
        margin-left: 0;
        text-align: center;
      }

      .forgetPwd {
        text-align: right;
        font-size: 14px;
        a {
          color: #409EFF;
        }
      }
    }
  }
</style>
