const router = require('koa-router')()
const Video = require('../models/video')
const VideoType = require('../models/videoType')
const User = require('../models/user')
const Comment = require('../models/comment')
const middleware = require('./middleware')
const file = require('../util/file')

router.prefix('/api/video')

router.get('/hotList', async (ctx, next) => {
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = await Video.findHotVideo()
    body.result = list
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 获取视频列表
router.get('/videoList', async (ctx, next) => {
  let {search, audit, page, pageSize} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }
  // 转换成整型
  page = page | 0
  pageSize = pageSize | 0

  try {
    let videos = await Video.findAll(search, page, pageSize, audit)
    let total = await Video.getTotal(search, audit)
    body.result = videos
    body.total = total
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 获取视频详情信息
router.get('/getVideo', async (ctx, next) => {
  let {id} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let video = await Video.findVideo(id)
    video._doc.comment = video.comment.length
    body.result = video
  } catch (err) {
    console.log(err)
    body.error = err
  }

  ctx.body = body
})

// 视频播放量增加
router.post('/playNumUp', async (ctx, next) => {
  let {id} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    await Video.playNumUp(id)
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

router.get('/rankList', async (ctx, next) => {
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = []
    let playList = await Video.findVideoRank('play')
    let favList = await Video.findVideoRank('fav')
    let scoreList = await Video.findVideoRank('rate')
    list.push(playList)
    list.push(favList)
    list.push(scoreList)
    body.result = list
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

router.get('/monthList', async (ctx, next) => {
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = await Video.findMonthList()
    let today = 0
    let three = 0
    let week = 0
    let month = 0
    let now = Date.now()

    list.forEach(v => {
      let time = new Date(v.createTime)
      let delat = (now - time) / 1000 / 60 / 60 / 24
      if (delat <= 1) {
        today++
        three++
        week++
        month++
      } else if (delat <= 3) {
        three++
        week++
        month++
      } else if (delat <= 7) {
        week++
        month++
      } else if (delat <= 30) {
        month++
      }
    })

    let result = [today, three, week, month]
    body.result = result
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.use(middleware.loginIntercept)

// 视频名称是否存在
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

// 提交视频审核
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

// 获取用户的视频列表
router.get('/userVideoList', async (ctx, next) => {
  let {id, page, pageSize} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }
  page = page | 0
  pageSize = pageSize | 0

  try {
    let list = await Video.findByUserId(id, page, pageSize)
    if (page && pageSize) {
      let total = await Video.getUserVideoTotal(id)
      body.total = total
    }
    body.result = list
  } catch (err) {
    body.error = 0
    console.log(err)
  }

  ctx.body = body
})

// 删除视频
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

    await Comment.deleteByVid(id)
    await User.removeUploadVideo(video.publisher, id)
    await User.removeStoreVideo(video.publisher, id)
    await VideoType.deleteVideo(video.type, id)
  } catch (err) {
    console.log(err)
    body.error = err
  }

  ctx.body = body
})

// 收藏视频
router.post('/storeVideo', async (ctx, next) => {
  let {vid, uid} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let flag = await User.findStoreVideo(uid, vid)
    if (flag) { // 如果存在取消收藏
      await Video.storeNumChange(vid, false)
      await User.removeStoreVideo(uid, vid)
      body.result = false
    } else { // 不存在添加收藏
      await Video.storeNumChange(vid, true)
      await User.addStoreVideo(uid, vid)
      body.result = true
    }
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 评价视频
router.post('/submitRate', async (ctx, next) => {
  let {uid, vid, rate} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let userRate = {
      user_id: uid,
      rate: rate
    }
    // let v = await Video.addRate(vid, userRate)
    let v = await Video.findById(vid).exec()
    v.score.push(userRate)
    let score = 0
    v.score.forEach(item => {
      score += item.rate
    })
    score = (score / v.score.length).toFixed(1)
    v._doc.rate = score
    v.save()
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

module.exports = router
