<template>
  <div class="registe-wrapper">
    <div class="registe-form">
      <h1 class="form-title">注册</h1>
      <el-form :model="ruleForm" status-icon :rules='rules' ref="ruleForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input type="password" v-model="ruleForm.passWord"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passWord2">
          <el-input type="password" v-model="ruleForm.passWord2"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"  prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="yzm">
          <yzm @draw = 'draw'></yzm>
          <el-input v-model="ruleForm.yzm" class="yzm-input"></el-input>
        </el-form-item>
        <el-form-item class="registe-btn">
          <el-button type="primary" @click="registe">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {baseFormMixin} from '@/mixins/baseFormMixin'
  import {_checkUserName} from '@/util/check'
  import {registeUser} from '@/api/User'

  export default {
    mixins: [baseFormMixin],
    data () {
      const comparePwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认密码'))
        } else if (value !== this.ruleForm.passWord) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }

      return {
        ruleForm: {
          passWord2: '', // 确认密码
          name: '', // 昵称
          email: '' // 邮箱
        },
        rules: {
          userName: [
            {validator: _checkUserName(true), trigger: 'blur'}
          ],
          passWord2: [
            {validator: comparePwd, trigger: 'blur'}
          ],
          name: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ]
        }
      }
    },
    methods: {
      registe () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            registeUser(this.ruleForm).then(() => {
              alert('注册成功')
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
  .registe-wrapper{
    width: 100%;
    min-height: calc(100% - 161px); 
    background: url('../assets/register.jpg') no-repeat center;
    background-size: 100% auto;
    background-position-y: 100%;
    background-color: #f8f7f5;
    overflow: hidden;

    .registe-form {
      width: 350px;
      margin: 5% auto;
      padding: 15px 40px 10px 10px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 7px 7px 5px #ddd;

      .form-title{
        text-align: center;
        margin-left: 40px;
        margin-bottom: 15px;
      }

      .yzm-input{
        width: 170px;
        float: left;
        margin-right: 20px;
      }

      .registe-btn{
        margin-left: -50px;
        text-align: center;
      }
    }
  }
</style>
