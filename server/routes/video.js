const router = require('koa-router')()
const Video = require('../models/video')
const VideoType = require('../models/videoType')
const User = require('../models/user')
const middleware = require('./middleware')
const file = require('../util/file')

router.prefix('/api/video')

router.get('/videoList', async (ctx, next) => {
  let {search, audit} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let videos = await Video.findAll(search, audit)
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

router.get('/userVideoList', async (ctx, next) => {
  let {id} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = await Video.findByUserId(id)
    body.result = list
  } catch (err) {
    body.error = 0
    console.log(err)
  }

  ctx.body = body
})

router.post('/delete', async (ctx, next) => {
  let {id} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let video = await Video.findById(id).exec()
    await Video.deleteById(id)
    // 删除视频文件
    file.deleteFile(video.src)
    file.deleteFile(video.img)

    await User.removeUploadVideo(video.publisher, id)
    await VideoType.deleteVideo(video.type, id)
  } catch (err) {
    console.log(err)
    body.error = err
  }

  ctx.body = body
})

module.exports = router
