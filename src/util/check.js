import {checkUserName} from '@/api/User'

// 校验用户名是否规范
export const _checkUserName = (rule, value, callback) => {
  // 判断用户名是否为空
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }

  // 查询用户名是否存在
  checkUserName().then(res => {
    console.log(res.data)
    if (res.data.error === 0) {
      callback(new Error('用户名不存在'))
    } else {
      callback()
    }
  })
}

// 校验密码是否规范
export const _checkPassWord = (rule, value, callback) => {
  // 判断密码是否为空
  if (!value) {
    return callback(new Error('密码不能为空'))
  } else {
    callback()
  }
}
