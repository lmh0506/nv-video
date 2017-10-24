const router = require('koa-router')()
const Comment = require('../models/comment')
const Video = require('../models/video')
const middleware = require('./middleware')
require('../util/time')

router.prefix('/api/comment')

router.use(middleware.loginIntercept)

router.post('/submit', async (ctx, next) => {
  let {from_user, content, vid} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }
  let createTime = (new Date().Format('yyyy-MM-dd hh:mm:ss')).toString()

  try {
    let comment = new Comment({
      from_user,
      createTime,
      content
    })
    comment = await comment.save()
    await Video.addComment(vid, comment.id)
    body.result = createTime
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.post('/reply', async (ctx, next) => {
  let {from_user, to_user, content, cid} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }
  let createTime = (new Date().Format('yyyy-MM-dd hh:mm:ss')).toString()

  try {
    let reply = {
      from_user,
      content,
      createTime
    }
    if (to_user) {
      reply.to_user = to_user
    }
    body.result = createTime
    await Comment.addReply(cid, reply)
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

module.exports = router
