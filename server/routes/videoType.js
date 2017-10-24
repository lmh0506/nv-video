const router = require('koa-router')()
const VideoType = require('../models/videoType')
const User = require('../models/user')
const Video = require('../models/video')
const middleware = require('./middleware')
const file = require('../util/file')

router.prefix('/api/video/type')

// 查询分类是否存在
router.post('/exist', async (ctx, next) => {
  let {name} = ctx.request.body

  let body = {
    error: 0,
    msg: ''
  }

  try {
    let type = await VideoType.findByName(name)

    if (type) {
      body.error = 10001
    }
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

// 获取分类列表
router.get('/getList', async (ctx, next) => {
  let {searchKey} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = await VideoType.findAll(searchKey)
    body.result = list
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.use(middleware.loginIntercept)

// 添加分类
router.post('/add', async (ctx, next) => {
  let {name} = ctx.request.body

  let body = {
    error: 0,
    msg: ''
  }

  try {
    let type = new VideoType({name})
    type = await type.save()
    body.result = type
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

// 删除分类
router.post('/delete', async (ctx, next) => {
  let {id} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    // 查询删除的类型
    let type = await VideoType.findById(id).exec()
    // 删除该类型下的所有视频
    type.videos.forEach(async v => {
      let video = await Video.findById(v).exec()
      await Video.deleteById(v)
      // 删除视频文件
      file.deleteFile(video.src)
      file.deleteFile(video.img)

      await User.removeUploadVideo(video.publisher, v)
      await User.removeStoreVideo(video.publisher, v)
    })

    // 删除类型
    await VideoType.deleteById(id)
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 更新分类名称
router.post('/update', async (ctx, next) => {
  let {id, name} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    await VideoType.updateById(id, name)
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

module.exports = router
