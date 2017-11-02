const router = require('koa-router')()
const User = require('../models/user')
const VideoType = require('../models/videoType')
const Video = require('../models/video')
const middleware = require('./middleware')
const sendEmail = require('../util/mail')
const file = require('../util/file')
const fs = require('fs')
const path = require('path')

var emailMap = new Map()
const YZM_LEN = 6

router.prefix('/api/user')

// 检测用户是否存在
router.post('/exist', async (ctx, next) => {
  let {userName, name, email, phone, id} = ctx.request.body
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
    } else if (id) { // 查找id是否存在
      user = await User.findById(id).exec()
    }

    if (user) {
      // 已存在
      body.error = 10001

      if (id) {
        let {id, avatar, name} = user
        body.result = {id, avatar, name}
      }
    }

    if (id && !ctx.session.user) { // 通过id进行查找用户时  如果未登录则无法查询
      body.error = 10002
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
    let {name, avatar, id} = await User.findById(user.id).exec()
    ctx.body = {
      error: 0,
      result: {name, avatar, id}
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

// 发送验证邮箱
router.post('/sendEmail', async (ctx, next) => {
  // 获取发送目标的邮箱地址
  let email = ctx.request.body.email
  let _str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let _strLen = _str.length
  let yzm = ''
  // 生成验证码
  for (let i = 0; i < YZM_LEN; i++) {
    yzm += _str[randomNum(0, _strLen)]
  }
  let body = {
    error: 0,
    msg: ''
  }
  try {
    await sendEmail(email, '找回密码验证码', `您的验证码是${yzm}`)
    emailMap.set(email, yzm)
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

// 检查邮箱验证码是否正确
router.post('/checkEmailYzm', async (ctx, next) => {
  let {yzm, email} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  let emailYzm = emailMap.get(email)
  if (emailYzm !== yzm) {
    body.error = 1
  } else {
    emailMap.delete(email)
  }

  ctx.body = body
})

// 设置新密码
router.post('/setNewPwd', async (ctx, next) => {
  let {passWord, email} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    await User.updatePwd(email, passWord)
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
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
  let {id, userForm} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }
  try {
    await User.updateUser(id, userForm)
  } catch (err) {
    body.error = 1
    console.log(err)
  }

  ctx.body = body
})

// 获取用户数据
router.get('/getUser', async (ctx, next) => {
  let {id} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let user = await User.findById(id).exec()
    let {name, email, phone} = user
    body.result = {name, email, phone}
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 上传头像
router.post('/avatar/upload', async (ctx, next) => {
  let avatar = ctx.request.body.files.file
  let id = ctx.request.body.fields.id

  let body = {
    error: 0,
    msg: ''
  }

  if (avatar) {
    let {fileData, newPath, newFileName} = getFilePath(avatar, id)
    try {
      // 保存文件
      fs.writeFileSync(newPath, fileData)

      let user = await User.findById(id).exec()
      let oldAvatar = user.avatar
      if (oldAvatar.indexOf('default') < 0) {
        // 删除旧头像 但不是默认头像
        file.deleteFile(oldAvatar)
      }

      let url = '/upload/' + id + '/' + newFileName
      await User.updateUser(id, {'avatar': url})
      body.result = url
    } catch (err) {
      console.log(err)
      body.error = 1
    }
  }
  ctx.body = body
})

// 上传视频
router.post('/video/upload', async (ctx, next) => {
  let {file, videoImg} = ctx.request.body.files
  let {id, name, type, vid} = ctx.request.body.fields

  let body = {
    error: 0,
    msg: ''
  }

  if (file) {
    let {fileData, newPath, newFileName} = getFilePath(file, id)
    try {
      // 保存文件
      fs.writeFileSync(newPath, fileData)
      let video = {name, type}

      let url = '/upload/' + id + '/' + newFileName
      video.src = url
      video.publisher = id

      // 保存视频数据
      video = new Video(video)
      video = await video.save()

      // 将视频添加到相应的用户和类型中  以便关联
      let vid = video.id
      let user = await User.findById(id).exec()
      user.uploadVideo.push(vid)
      await User.updateUser(id, {'uploadVideo': user.uploadVideo})

      let vType = await VideoType.findById(type).exec()
      vType.videos.push(vid)
      await vType.save()

      body.result = {vid}
    } catch (err) {
      console.log(err)
      body.error = 1
    }
  } else {
    let {fileData, newPath, newFileName} = getFilePath(videoImg, id)
    try {
      // 保存文件
      fs.writeFileSync(newPath, fileData)

      let url = '/upload/' + id + '/' + newFileName
      await Video.updateImg(vid, url)
    } catch (err) {
      console.log(err)
      body.error = 1
    }
  }

  ctx.body = body
})

// 获取收藏列表
router.get('/video/storeList', async (ctx, next) => {
  let {id, page, pageSize} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  page = page | 0
  pageSize = pageSize | 0

  try {
    let user = await User.findAllStore(id, page, pageSize)
    if (user) {
      body.result = user.storeVideo
    } else {
      body.result = []
    }
    user = await User.findById(id).exec()
    body.total = user.storeVideo.length
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

// 判断用户是否已收藏
router.get('/video/isStoreAndRate', async (ctx, next) => {
  let {uid, vid} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let user = await User.findStoreVideo(uid, vid)
    if (user) { // 返回用户是否收藏
      body.store = true
    } else {
      body.store = false
    }
    let video = await Video.findById(vid).exec()
    video.score.forEach(item => {
      if (item.user_id == uid) { // 获取当前用户的评价
        body.rate = item.rate
      }
    })
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.post('/video/removeStore', async (ctx, next) => {
  let {uid, vid} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    await User.removeStoreVideo(uid, vid)
    await Video.storeNumChange(vid, false)
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

router.get('/video/myHotVideo', async (ctx, next) => {
  let {id} = ctx.request.query
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = await User.findHotVideo(id)
    body.result = list
  } catch (err) {
    console.log(err)
    body.error = 1
  }
  ctx.body = body
})

router.get('/userAdminList', async (ctx, next) => {
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let list = await User.findUserAdmin()
    body.result = list
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.post('/setAdmin', async (ctx, next) => {
  let {user, flag} = ctx.request.body
  let body = {
    error: 0,
    msg: ''
  }

  try {
    flag = flag === 'left' ? 0 : 1
    user.forEach(async id => {
      await User.setAdmin(id, flag)
    })
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

router.post('/isAdmin', async (ctx, next) => {
  let {id} = ctx.session.user
  let body = {
    error: 0,
    msg: ''
  }

  try {
    let user = await User.isAdmin(id)
    if (!user) {
      body.error = 10001
    }
  } catch (err) {
    console.log(err)
    body.error = 1
  }

  ctx.body = body
})

module.exports = router

function randomNum (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getFilePath (file, id) { // 获取文件上传路径和数据
  var result = {}
  // 获取上传文件的路径
  let filePath = file.path
  // 获取上传文件的文件名和后缀
  let fileNameArr = file.name.split('.')
  let fileName = fileNameArr[0]
  let fileType = fileNameArr[fileNameArr.length - 1]
  if (fileName) {
    result.fileData = fs.readFileSync(filePath)
    let timestamp = Date.now()

    // 初始化保存的文件名称及保存位置
    result.newFileName = timestamp + '.' + fileType
    let uploadPath = path.join(__dirname, '../', '/public/upload/' + id)

    if (!fs.existsSync(uploadPath)) { // 如果上传目录不存在
      fs.mkdirSync(uploadPath) // 新建上传目录
    }
    result.newPath = path.join(uploadPath, '/' + result.newFileName)
  }

  return result
}
