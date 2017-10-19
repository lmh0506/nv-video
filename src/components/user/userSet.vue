<template>
  <div class="userSet-wrapper">
    <div class="user-set">
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="用户信息设置">
          <h3 class="user-set-title">用户信息设置</h3>
          <div class="user-set-content">
            <el-form class="user-set-form" label-width="80px" status-icon :model="userForm" :rules="rules">
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
        </el-tab-pane>
        <el-tab-pane label="上传头像">
          <h3 class="user-set-title">上传头像</h3>
          <el-upload
            class="avatar-uploader"
            drag
            :data="avatarForm"
            action="/api/user/avatar/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError">
            
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <div class="upload-wrapper" v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {getUser, updateUser} from '@/api/User'
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
        },
        imageUrl: '',
        avatarForm: {
          id: this.$route.params.id
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
        updateUser(this.user.id, this.userForm).then(res => {
          if (res.data.error === ERR_OK) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      handleAvatarSuccess (res, file) {
        // 上传成功
        this.imageUrl = URL.createObjectURL(file.raw)
        if (res.error === ERR_OK) {
          this.$message.success('上传成功')
          // 更新vuex中的头像路径
          let user = {...this.user}
          user.avatar = res.result
          this.updateUser(user)
        } else if (res.error === NO_LOGIN) {
          this.$router.push('/login')
        } else {
          this.$message.error('上传失败')
          this.imageUrl = ''
        }
      },
      handleAvatarError (res) {
        this.$message.error('上传失败')
        this.imageUrl = ''
      },
      beforeAvatarUpload (file) {
        // 上传之前
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 0.5

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 500KB!')
        }
        return isJPG && isLt2M
      },
      ...mapMutations([
        'updateUser'
      ])
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
      margin-left: 30px;
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

    .avatar-uploader {
      text-align: center;

      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .el-upload:hover {
        border-color: #409EFF;
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
      margin: 0px auto;
    }
  }
</style>
