const router = require('koa-router')()
const User = require('../models/user')
const middleware = require('./middleware')

router.prefix('/api/user')

// 检测用户是否存在
router.post('/exist', async (ctx, next) => {
  let {userName, name, email, phone} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    var user
    if (userName) { // 查找用户名是否存在
      user = await User.findByUserName(userName)
    } else if (name) { // 查找昵称是否存在
      user = await User.findByName(name)
    } else if (email) { // 查找邮箱是否存在
      user = await User.findByEmail(email)
    } else if (phone) { // 查找手机号码是否存在
      user = await User.findByPhone(phone)
    }

    if (user) {
      // 已存在
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

    // 注册成功时 存储用户的session信息
    let {name, avatar, id} = user
    ctx.session.user = {name, avatar, id}
    body.result = {name, avatar, id}
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
    } else {
      // 登录成功时 存储用户的session信息
      let {name, avatar, id} = user
      ctx.session.user = {name, avatar, id}
      body.result = {name, avatar, id}
    }
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

// 检测用户是否登录
router.get('/checkLogin', async (ctx, next) => {
  let user = ctx.session.user
  if (user) {
    ctx.body = {
      error: 0,
      result: user
    }
  } else {
    ctx.body = {
      error: 10002,
      msg: '未登录'
    }
  }
})

// 用户退出登录
router.get('/loginOut', async (ctx, next) => {
  // 清除session
  ctx.session.user = null
  ctx.body = {
    error: 0,
    msg: '退出成功'
  }
})

router.use(middleware.loginIntercept)

// 获取用户列表数据
router.get('/getList', async (ctx, next) => {
  let body = {
    error: 0,
    msg: ''
  }

  let {pageSize, page, searchKey} = ctx.request.query

  page = page * 1
  pageSize = pageSize * 1

  try {
    // 获取分页数据
    let users = await User.findAll(page, pageSize, searchKey)
    let list = []
    // 获取总数
    let total = await User.getTotal(searchKey)
    users.forEach(item => {
      let {id, userName, email, name, phone} = item
      list.push({id, userName, email, name, phone})
    })
    body.result = list
    body.total = total
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

// 删除用户
router.post('/delete', async (ctx, next) => {
  let id = ctx.request.body.id
  let body = {
    error: 0,
    msg: ''
  }
  try {
    await User.deleteById(id)
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

// 更新用户
router.post('/update', async (ctx, next) => {
  let {userForm} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }
  try {
    await User.updateUser(userForm)
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

module.exports = router
