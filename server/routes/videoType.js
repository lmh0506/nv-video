const router = require('koa-router')()
const VideoType = require('../models/videoType')
const middleware = require('./middleware')

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
    await type.save()
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

module.exports = router
