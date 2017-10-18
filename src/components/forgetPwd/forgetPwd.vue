<template>
  <div class="forgetPwd-wrapper">
    <el-main>
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="身份验证" ></el-step>
        <el-step title="设置新密码" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>
      <div class="verification" v-if="active === 0">
        <el-form :model="ruleForm" status-icon :rules="rules" label-width="80px" class="verification-ruleForm">
          <p class="verification-title">请输入您账户绑定的邮箱地址</p>
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="ruleForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :error='errorMsg' label="验证码" prop="yzm">
            <el-input :disabled="disabled" v-model="ruleForm.yzm" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="verification-btn">
            <el-button type="primary" style="padding: 12px 39px;" @click="verification" v-if="!disabled">验证</el-button>
            <el-button :disabled="btnDisabled" type="primary" v-if="disabled" @click="sendEmail">{{btnText}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="newPwd" v-else-if = "active === 1">
        <el-form :model="pwdForm" status-icon :rules="pwdRules" ref="pwdForm" label-width="100px" class="verification-ruleForm">
          <p class="verification-title">请设置您的新密码</p>
          <el-form-item label="新密码" prop="passWord">
            <el-input type="password" v-model="pwdForm.passWord" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :error='errorMsg' label="请再次输入" prop="passWord2">
            <el-input type="password" v-model="pwdForm.passWord2" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="verification-btn">
            <el-button type="primary" @click="setPwd">完成</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="success" v-else-if="active === 2">
        <div class="success-main">
          <h1 class="success-title">设置成功<i class="el-icon-success"></i></h1>
          <router-link class="toLogin" to="/login">立即登录</router-link>
        </div>
      </div>
    </el-main>
    
  </div>
</template>

<script>
  import {_checkEmail} from '@/util/check'
  import {sendEmail, checkEmailYzm, setNewPwd} from '@/api/User'
  import {ERR_OK} from '@/config/index'

  export default {
    data () {
      const comparePwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认密码'))
        } else if (value !== this.pwdForm.passWord) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }

      return {
        active: 0,
        ruleForm: {
          email: '',
          yzm: ''
        },
        rules: {
          email: [
            { validator: _checkEmail(false), trigger: 'blur' }
          ],
          yzm: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
        errorMsg: '',
        disabled: true,
        btnText: '发送验证码',
        btnDisabled: false,
        pwdForm: {
          passWord: '',
          passWord2: ''
        },
        pwdRules: {
          passWord: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          passWord2: [
            { validator: comparePwd, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      next () {
        this.active ++
      },
      sendEmail () { // 发送邮箱
        this.btnText = '正在发送...'
        this.btnDisabled = true
        sendEmail(this.ruleForm.email).then(res => {
          if (res.data.error === ERR_OK) {
            this.disabled = false
            this.$message({
              type: 'success',
              message: '发送成功，请及时去邮箱查看'
            })
          } else {
            this.$message({
              type: 'info',
              message: '发送失败，请重新发送'
            })
          }
          this.btnText = '发送验证码'
          this.btnDisabled = false
        })
      },
      verification () { // 验证身份
        checkEmailYzm(this.ruleForm).then(res => {
          if (res.data.error === ERR_OK) {
            this.errorMsg = ''
            this.next()
          } else {
            this.errorMsg = '验证码错误'
          }
        })
      },
      setPwd () { // 设置新密码
        this.$refs['pwdForm'].validate((valid) => {
          if (valid) {
            setNewPwd(this.ruleForm.email, this.pwdForm.passWord).then(res => {
              if (res.data.error === ERR_OK) {
                this.next()
              } else {
                this.$message({
                  type: 'info',
                  message: '服务器繁忙，请稍后再试'
                })
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
  .forgetPwd-wrapper {
    width: 1100px;
    margin: 20px auto 0px;
    min-height: calc(100% - 182px);

    .verification-ruleForm {
      width: 320px;
      margin: 50px auto 0px;

      .verification-title{
        margin: 0 0 20px 12px;
        color: #409EFF;
      }

      .verification-btn{
        text-align: center;
      }
    }

    .success-main {
      width: 320px;
      margin: 50px auto 0px;
      text-align: center;

      .success-title {
        color: #67c23a;
        letter-spacing: 10px;
        margin-bottom: 50px;
      }

      .toLogin {
        color: #409EFF;
      }
    }
  }
</style>
