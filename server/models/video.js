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
  }, // 审核过程
  rate: {
    type: Number,
    default: 0
  } // 评分
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
    return this.findById(id, {'score': 0})
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
  addComment (vid, cid) {
    return this.update({'_id': vid}, {$push: {'comment': cid}}).exec()
  },
  removeComment (vid, cid) {
    return this.update({'_id': vid}, {$pull: {'comment': cid}}).exec()
  },
  findHotVideo () {
    return this.find({}, {img: 1, name: 1})
      .sort({'rate': -1, 'fav_num': -1, 'vplaynum': -1})
      .limit(5)
      .exec()
  },
  findDetailList (id, flag, page, pageSize) {
    const skip = (page - 1) * pageSize
    flag = flag === 'true' ? {'createTime': -1} : {'fav_num': -1, 'vplaynum': -1}
    return this.find({'type': id})
      .skip(skip)
      .limit(pageSize)
      .sort(flag)
      .exec()
  },
  findVideoRank (flag) {
    let query
    if (flag === 'play') {
      flag = {'vplaynum': -1}
      query = {'vplaynum': 1}
    } else if (flag === 'fav') {
      flag = {'fav_num': -1}
      query = {'fav_num': 1}
    } else {
      flag = {'rate': -1}
      query = {'rate': 1}
    }
    query.name = 1
    return this.find({}, query)
      .sort(flag)
      .limit(10)
      .exec()
  },
  findMonthList () { // 查找最近一个月的视频列表
    let now = new Date()
    let m1 = now.getMonth() + 1 // 这个月
    let m2 = m1 - 1 // 上个月
    let y1 = now.getFullYear() // 今年
    let y2 = m2 < 0 ? y1 - 1 : y1 // 如果上个月是去年就为去年
    m1 = m1.toString().length === 1 ? '0' + m1.toString() : m1.toString()
    m2 = m2.toString().length === 1 ? '0' + m2.toString() : m2.toString()
    let reg1 = y1 + '-' + m1
    let reg2 = y2 + '-' + m2
    let reg = new RegExp('(' + reg1 + '|' + reg2 + ')')
    return this.find({createTime: reg}, {createTime: 1}).exec()
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
