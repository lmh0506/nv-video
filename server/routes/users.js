const router = require('koa-router')()
const User = require('../models/user')

router.prefix('/api/user')

// 检测用户是否存在
router.post('/exist', async (ctx, next) => {
  let {userName} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let user = await User.findByUserName(userName)

    if (!user) {
      // 用户不存在
      body.error = 10001
    }
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

// 注册用户
router.post('/registe', async (ctx, next) => {
  // 接收注册表单数据
  let user = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }
  try {
    // 存储用户信息
    user = new User(user)
    await user.save()
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 用户登录
router.post('/login', async (ctx, next) => {
  let {userName, passWord} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let user = await User.findByUserName(userName)
    if (!user.comparePassword(passWord)) {
      // 密码错误
      body.error = 10001
    }
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
