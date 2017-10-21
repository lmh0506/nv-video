const router = require('koa-router')()
const Video = require('../models/video')
const middleware = require('./middleware')

router.prefix('/api/video')

router.get('/videoAuditList', async (ctx, next) => {
  let {search} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let videos = await Video.findAuditVideo(search)
    body.result = videos
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.use(middleware.loginIntercept)

router.post('/exist', async (ctx, next) => {
  let {name} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let video = await Video.findByName(name)
    if (video) {
      body.error = 10001
    }
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.post('/shenhe', async (ctx, next) => {
  let {id, shenhe} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let video = await Video.findById(id).exec()
    video.shenhe = shenhe
    await video.save()
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

module.exports = router
