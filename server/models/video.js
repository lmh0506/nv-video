const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
require('../util/time')

var VideoSchema = new mongoose.Schema({
  name: String, // 视频名字
  src: String, // 视频播放地址
  vplaynum: {
    type: Number,
    default: 0
  }, // 视频播放次数
  createTime: Date, // 视频发布时间
  img: {
    type: String,
    default: ''
  }, // 视频预览图
  comment: [{
    type: ObjectId,
    ref: 'User'
  }], // 视频评论
  score: {
    type: Number,
    default: 0
  }, // 视频评分
  type: {
    type: ObjectId,
    ref: 'VideoType'
  }, // 视频分类
  publisher: {
    type: ObjectId,
    ref: 'User'
  }, // 视频发布人
  fav_num: {
    type: Number,
    default: 0
  }, // 视频收藏数
  shenhe: {
    type: String,
    default: 'ing'
  } // 审核过程
})

// 在存储视频数据前进行一些处理
VideoSchema.pre('save', function (next) {
  // 存储发布时间
  if (this.isNew) {
    this.createTime = new Date().Format('yyyy-MM-dd hh:mm:ss')
  }
  next()
})

VideoSchema.statics = {
  updateImg (id, img) {
    return this.update({'_id': id}, {img}).exec()
  },
  findByName (name) {
    return this.findOne({name}).exec()
  },
  deleteById (id) {
    return this.remove({'_id': id}).exec()
  },
  findAuditVideo (name) { // 查找审核中的视频
    let query = name ? {'name': new RegExp(name), 'shenhe': 'ing'} : {'shenhe': 'ing'}
    return this.find(query)
      .populate({
        path: 'publisher',
        select: 'name'
      })
      .populate({
        path: 'type',
        select: 'name'
      })
      .exec()
  }
}

module.exports = mongoose.model('Video', VideoSchema)
