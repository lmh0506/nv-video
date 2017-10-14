import {checkUserName, checkName} from '@/api/User'
import {ERR_OK} from '@/config/index'

// 校验用户名是否规范
export const _checkUserName = flag => {
  return (rule, value, callback) => {
    // 判断用户名是否为空
    if (!value) {
      return callback(new Error('请输入用户名'))
    }

    // 查询用户名是否存在
    checkUserName(value).then(res => {
      // 通过flag标识来判断是在登录表单还是注册表单进行的校验 避免出现的提示信息错误
      if (res.data.error === (flag ? ERR_OK : 10001)) {
        callback(new Error(flag ? '用户名已存在' : '用户名不存在'))
      } else {
        callback()
      }
    })
  }
}

// 校验密码是否规范
export const _checkPassWord = (rule, value, callback) => {
  // 判断密码是否为空
  if (!value) {
    return callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

// 检测昵称是否规范
export const _checkName = (rule, value, callback) => {
  // 判断昵称是否为空
  if (!value) {
    return callback(new Error('请输入昵称'))
  } else if (value.length < 3 && value.length > 8) {
    return callback(new Error('长度在 3 到 8 个字符'))
  }

  // 查询昵称是否存在
  checkName(value).then(res => {
    if (res.data.error !== ERR_OK) {
      callback(new Error('该昵称已被占用'))
    } else {
      callback()
    }
  })
}
