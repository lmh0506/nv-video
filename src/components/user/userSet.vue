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
        <el-tab-pane label="上传视频">
          <h3 class="user-set-title">上传视频</h3>
          <el-form :model="videoForm" status-icon :rules="videoRules" label-width="100px" class="video-ruleForm" ref="videoForm">
            <el-form-item label="视频名称" prop="name">
              <el-input v-model="videoForm.name"></el-input>
            </el-form-item>
            <el-form-item label="视频文件">
              <el-upload
                ref="videoUpload"
                class="video-uploader"
                :data="videoForm"
                action="/api/user/video/upload"
                :before-upload="beforeVideoUpload"
                :auto-upload="autoUpload"
                :on-change="handleVideoChange"
                :on-success="handleVideoSuccess">
                
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传mp4文件，且不超过100mb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="视频预览图">
              <el-upload
                class="avatar-uploader"
                ref="videoImg"
                drag
                name="videoImg"
                action="/api/user/video/upload"
                :data="videoForm"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :auto-upload="autoUpload"
                :on-change="VideoImgChange"
                :on-success="videoImgSuccess">
                
                <img v-if="videoImg" :src="videoImg" class="video-img">
                <div class="upload-wrapper" v-else>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="视频分类" prop="type">
              <el-select v-model="videoForm.type" placeholder="请选择" v-if="typeList.length > 0">
                <el-option
                  v-for="item in typeList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="success" @click="videoUpload">上传到服务器</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {getUser, updateUser} from '@/api/User'
  import {getTypeList} from '@/api/VideoType'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {_checkName, _checkEmail, _checkPhone, _checkVideoName} from '@/util/check'

  export default {
    data () {
      return {
        userForm: { // 用户信息表单
          name: '',
          phone: '',
          email: ''
        },
        rules: { // 用户信息校验
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
        imageUrl: '', // 图片地址
        avatarForm: { // 上传头像表单
          id: this.$route.params.id
        },
        autoUpload: false, // 不自动上传视频
        videoForm: { // 视频表单
          id: this.$route.params.id,
          name: '',
          type: ''
        },
        videoRules: { // 视频校验表单
          name: [
            { validator: _checkVideoName, trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择视频类型', trigger: 'blur' }
          ]
        },
        typeList: [], // 视频分类列表
        videoImg: ''
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
          if (this.user.id === this.$route.params.id) {
            getUser(this.user.id).then(res => {
              if (res.data.error === ERR_OK) {
                this.userForm = res.data.result
              } else if (res.data.error === NO_LOGIN) {
                this.$router.push('/login')
              }
            })
          } else { // 不是本人就跳转到404界面
            this.$router.push('/404')
          }
        }
      },
      getTypeList () {
        getTypeList().then(res => {
          if (res.data.error === ERR_OK) {
            this.typeList = res.data.result
          }
        })
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
        const isLt500KB = file.size / 1024 / 1024 < 0.5

        if (!isJPG) {
          this.$message.error('上传的图片只能是 JPG或PNG 格式!')
        }
        if (!isLt500KB) {
          this.$message.error('上传的图片大小不能超过 500KB!')
        }
        return isJPG && isLt500KB
      },
      handleVideoChange (file, fileList) { // 限制上传的文件个数及格式
        if (fileList.length > 1 || !this.beforeVideoUpload(file.raw)) {
          fileList.splice(0, 1)
        }
      },
      beforeVideoUpload (file) { // 上传格式限制
        const isVideo = /video\/[mp4]/.test(file.type)
        const isLt100M = file.size / 1024 / 1024 < 100

        if (!isVideo) {
          this.$message.error('上传视频只能是 mp4 格式!')
        }
        if (!isLt100M) {
          this.$message.error('上传视频大小不能超过 100MB!')
        }

        return isVideo && isLt100M
      },
      VideoImgChange (file, fileList) {
        if (fileList.length > 1 || !this.beforeAvatarUpload(file.raw)) {
          fileList.splice(0, 1)
        } else {
          this.videoImg = file.url
        }
      },
      videoUpload () {
        this.$refs['videoForm'].validate((valid) => {
          if (valid) {
            if (this.$refs.videoUpload.uploadFiles.length === 0) {
              this.$message.error('请选择要上传的视频')
            } else if (this.$refs.videoImg.uploadFiles.length === 0) {
              this.$message.error('请选择要上传的视频预览图')
            } else {
              this.$refs.videoUpload.submit()
            }
          } else {
            return false
          }
        })
      },
      handleVideoSuccess (res, file, fileList) { // 视频上传结束
        if (res.error === ERR_OK) {
          this.videoForm.vid = res.result.vid
          this.$refs.videoImg.submit()
        } else if (res.error === NO_LOGIN) {
          this.$router.push('/')
        } else {
          this.$message.error('视频上传失败')
        }
      },
      videoImgSuccess (res, file, fileList) { // 视频预览图上传结束
        if (res.error === ERR_OK) {
          this.$message.success('上传成功')
          this.$refs.videoImg.clearFiles()
          this.$refs.videoUpload.clearFiles()
          this.$refs.videoForm.resetFields()
          this.videoImg = ''
        } else if (res.error === NO_LOGIN) {
          this.$router.push('/')
        } else {
          this.$message.error('视频预览图上传失败')
          this.videoImg = ''
        }
      },
      ...mapMutations([
        'updateUser'
      ])
    },
    mounted () {
      this.getUser()
      this.getTypeList()
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

    .video-ruleForm {
      width: 300px;
      margin: 0px auto;
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

    .video-img {
      height: 100%;
      display: block;
      margin: 0px auto;
    }
  }
</style>
