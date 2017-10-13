import {checkUserName} from '@/api/User'
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
