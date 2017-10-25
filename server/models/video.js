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
  createTime: String, // 视频发布时间
  img: {
    type: String,
    default: ''
  }, // 视频预览图
  comment: [{
    type: ObjectId,
    ref: 'Comment'
  }], // 视频评论
  score: [{
    user_id: ObjectId,
    rate: Number
  }], // 视频评分
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
  findAll (name, page, pageSize, flag) { // 查找全部的视频
    let query = getQuery(name, flag)
    const skip = (page - 1) * pageSize
    return this.find(query)
      .populate({
        path: 'publisher',
        select: 'name'
      })
      .populate({
        path: 'type',
        select: 'name'
      })
      .skip(skip)
      .limit(pageSize)
      .exec()
  },
  findByUserId (id, page, pageSize) { // 查找用户的视频列表
    if (page && pageSize) {
      const skip = (page - 1) * pageSize
      return this.find({'publisher': id, 'shenhe': '审核通过'})
        .skip(skip)
        .limit(pageSize)
        .exec()
    } else {
      return this.find({'publisher': id, 'shenhe': {$ne: '审核通过'}}).exec()
    }
  },
  getUserVideoTotal (id) {
    return this.count({'publisher': id, 'shenhe': '审核通过'}).exec()
  },
  getTotal (name, flag) {
    let query = getQuery(name, flag)
    return this.count(query).exec()
  },
  findVideo (id) {
    return this.findById(id)
      .populate({
        path: 'publisher',
        select: 'name avatar'
      })
      .populate({
        path: 'type',
        select: 'name'
      })
      .exec()
  },
  playNumUp (id) {
    return this.update({'_id': id}, {$inc: {'vplaynum': 1}}).exec()
  },
  storeNumChange (id, flag) {
    flag = flag ? 1 : -1
    return this.update({'_id': id}, {$inc: {'fav_num': flag}}).exec()
  },
  addRate (id, rate) {
    return this.update({'_id': id}, {$push: {'score': rate}}).exec()
  },
  addComment (vid, cid) {
    return this.update({'_id': vid}, {$push: {'comment': cid}}).exec()
  },
  removeComment (vid, cid) {
    return this.update({'_id': vid}, {$pull: {'comment': cid}}).exec()
  }
}

function getQuery (name, flag) {
  if (flag) { // 判断是否查询审核中的全部视频
    return name ? {'name': new RegExp(name)} : {}
  } else {
    return name ? {'name': new RegExp(name), 'shenhe': 'ing'} : {'shenhe': 'ing'}
  }
}

module.exports = mongoose.model('Video', VideoSchema)
