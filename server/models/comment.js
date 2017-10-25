const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var commentSchema = new mongoose.Schema({
  content: String, // 评论内容
  vid: {
    type: ObjectId,
    ref: 'Video'
  },
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
  },
  findAll (vid, page, pageSize, replySize) {
    const skip = (page - 1) * pageSize
    return this.find({vid})
      .populate('from_user', 'name avatar')
      .populate({
        path: 'reply',
        options: {limit: replySize}
      })
      .populate({
        path: 'reply.from_user reply.to_user',
        select: 'name avatar'
      })
      .limit(pageSize)
      .skip(skip)
      .sort({'createTime': 1})
      .exec()
  },
  findReplyList (id, page, pageSize) {
    const skip = (page - 1) * pageSize

    return this.findOne({'_id': id}, {'reply': {$slice: [skip, pageSize]}, 'content': 1, 'createTime': 1, 'vid': 1, 'from_user': 1, 'reply.content': 1, 'reply.createTime': 1})
    .populate({
      path: 'reply.from_user reply.to_user',
      select: 'name avatar'
    })
    .exec()
  }
}

module.exports = mongoose.model('Comment', commentSchema)
