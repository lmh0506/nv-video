<template>
  <div class='login-wrapper'>
    <div class="login-form">
      <h1 class="form-title">登录</h1>
      <el-form :model="ruleForm" status-icon :rules='rules' ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input type="password" v-model="ruleForm.passWord"></el-input>
        </el-form-item>
        <el-form-item prop="yzm">
          <yzm @draw = 'draw'></yzm>
          <el-input v-model="ruleForm.yzm" class="yzm-input"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary">登录</el-button>
          <el-button>          
            <router-link to="/registe">快速注册</router-link>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Yzm from '@/base/yzm'
  import {_checkUserName, _checkPassWord} from '@/util/check'

  export default {
    data () {
      const _checkYzm = (rule, value, callback) => {
        // 判断验证码是否为空
        if (!value) {
          return callback(new Error('验证码不能为空'))
        } else if (!this.isOk) {
          return callback(new Error('验证码错误'))
        } else {
          callback()
        }
      }

      return {
        ruleForm: {
          userName: '', // 用户名
          passWord: '', // 密码
          yzm: '' // 输入的验证码
        },
        rules: {
          userName: [
            {validator: _checkUserName, trigger: 'blur'}
          ],
          passWord: [
            {validator: _checkPassWord, trigger: 'blur'}
          ],
          yzm: [
            {validator: _checkYzm, trigger: 'blur'}
          ]
        },
        picText: '' // 获取的验证码
      }
    },
    computed: {
      // 校验验证码是否正确
      isOk () {
        return this.picText.toLowerCase() === this.ruleForm.yzm.toLowerCase()
      }
    },
    methods: {
      // 获取验证码的值
      draw (picText) {
        this.$nextTick(() => {
          this.picText = picText
        })
      }
    },
    components: {
      Yzm
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .login-wrapper{
    width: 100%;
    min-height: calc(100% - 161px); 
    background: url('../assets/login.jpg') no-repeat center;
    background-size: 100% auto;
    background-position-y: 20%;
    background-color: #ddd;

    .form-title{
      text-align: center;
      margin-bottom: 15px;
    }

    .login-form {
      width: 350px;
      padding: 10px 30px 10px 0;
      background-color: #fff;
      position: absolute;
      top: 20%;
      right: 15%;

      .yzm-input{
        width: 170px;
        float: left;
        margin-right: 20px;
      }

      .login-btn{
        margin-left: 0;
        text-align: center;
      }
    }
  }
</style>
