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
  phone: {
    type: String,
    default: ''
  }, // 手机
  name: String, // 昵称
  avatar: {
    type: String,
    default: '/images/default.jpg'
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

UserSchema.statics = {
  findByUserName (userName) { // 查找用户名
    return this.findOne({userName}).exec()
  },
  findByName (name) { // 查找昵称
    return this.findOne({name}).exec()
  },
  findByEmail (email) { // 查找邮箱
    return this.findOne({email}).exec()
  },
  findByPhone (phone) { // 查找手机号码
    return this.findOne({phone}).exec()
  },
  deleteById (id) {
    return this.remove({'_id': id}).exec()
  },
  updateUser (id, user) {
    return this.update({'_id': id}, user).exec()
  },
  findAll (page, pageSize, searchKey) {
    const skip = (page - 1) * pageSize
    let params = selectKey(searchKey)

    return this.find(params)
      .skip(skip)
      .limit(pageSize)
      .sort({'_id': 1})
      .exec()
  },
  getTotal (searchKey) {
    let params = selectKey(searchKey)
    return this.count(params).exec()
  },
  updatePwd (email, passWord) {
    return this.update({email}, {'passWord': Md5(passWord)}).exec()
  },
  removeUploadVideo (id, vid) {
    return this.update({'_id': id}, {$pull: {'uploadVideo': vid}}).exec()
  },
  addStoreVideo (uid, vid) { // 添加收藏
    return this.update({'_id': uid}, {$push: {'storeVideo': vid}})
  },
  removeStoreVideo (uid, vid) { // 取消收藏
    return this.update({'_id': uid}, {$pull: {'storeVideo': vid}})
  },
  findStoreVideo (uid, vid) { // 查找收藏列表中是否存在某视频
    return this.findOne({'_id': uid, 'storeVideo': vid})
  },
  findAllStore (id, page, pageSize) { // 获取收藏列表
    const skip = (page - 1) * pageSize
    return this.findOne({'_id': id}, {'storeVideo': {$slice: [skip, pageSize]}})
      .populate({
        path: 'storeVideo',
        select: 'name src img fav_num vplaynum shenhe'
      })
      .exec()
  }
}

function selectKey (searchKey) {
  if (searchKey) {
    // 利用正则来进行模糊查询
    searchKey = new RegExp(searchKey)
    return {$or: [{'userName': searchKey}, {'name': searchKey}, {'email': searchKey}, {'phone': searchKey}]}
  } else {
    return {}
  }
}

module.exports = mongoose.model('User', UserSchema)
