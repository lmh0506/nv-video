const mongoose = require('mongoose')
const Md5 = require('md5')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var UserSchema = new mongoose.Schema({
  userName: String, // 用户名
  passWord: String, // 用户密码
  storeVideo: [{
    type: ObjectId,
    ref: 'Video'
  }], // 收藏的视频
  uploadVideo: [{
    type: ObjectId,
    ref: 'Video'
  }], // 用户上传的视频
  email: String, // 邮箱
  phone: String, // 手机
  name: String, // 昵称
  avatar: {
    type: String,
    default: '/default.jpg'
  }, // 头像
  role: {
    type: Number,
    default: 0
  } // 用户权限 区分普通用户和管理员
})

UserSchema.methods = {
  // 密码是否相同
  comparePassword (password) {
    return Md5(password) === this.passWord
  }
}

// 在存储用户数据前进行一些处理
UserSchema.pre('save', function (next) {
  // 对密码进行加密
  this.passWord = Md5(this.passWord)
  next()
})

module.exports = mongoose.model('User', UserSchema)
