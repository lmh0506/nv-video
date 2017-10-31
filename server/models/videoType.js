const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var VideoTypeSchema = new mongoose.Schema({
  videos: [{
    type: ObjectId,
    ref: 'Video'
  }], // 分类下的所有视频
  name: String // 分类名称
})

VideoTypeSchema.statics = {
  findByName (name) {
    return this.findOne({name}).exec()
  },
  findAll (key) {
    key = key ? {'name': new RegExp(key)} : {}
    return this.find(key).exec()
  },
  deleteById (id) {
    return this.remove({'_id': id}).exec()
  },
  updateById (id, name) {
    return this.update({'_id': id}, {'name': name}).exec()
  },
  deleteVideo (id, vid) {
    return this.update({'_id': id}, {$pull: {'videos': vid}}).exec()
  },
  findHotList () {
    return this.find()
      .populate({
        path: 'videos',
        select: 'name img fav_num vplaynum shenhe',
        options: {limit: 12}
      })
      .exec()
  }
}

module.exports = mongoose.model('VideoType', VideoTypeSchema)
