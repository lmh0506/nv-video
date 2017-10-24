const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var commentSchema = new mongoose.Schema({
  content: String, // 评论内容
  from_user: {
    type: ObjectId,
    ref: 'User'
  }, // 发出评论的人
  createTime: String, // 评论发布时间
  reply: [{ // 回复内容
    content: String, // 评论内容
    from_user: {
      type: ObjectId,
      ref: 'User'
    }, // 发出评论的人
    to_user: {
      type: ObjectId,
      ref: 'User'
    }, // 被评论的人,
    createTime: String // 评论发布时间
  }]
})

commentSchema.statics = {
  addReply (cid, reply) {
    return this.update({'_id': cid}, {$push: {'reply': reply}}).exec()
  }
}

module.exports = mongoose.model('Comment', commentSchema)
