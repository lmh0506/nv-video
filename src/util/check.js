import {checkExist} from '@/api/User'
import {checkTypeName} from '@/api/VideoType'
import {checkVideoExist} from '@/api/Video'
import {ERR_OK} from '@/config/index'

// 校验用户名是否规范
export const _checkUserName = flag => {
  return (rule, value, callback) => {
    // 判断用户名是否为空
    if (!value) {
      return callback(new Error('请输入用户名'))
    }

    // 查询用户名是否存在
    checkExist({'userName': value}).then(res => {
      // 通过flag标识来判断是在登录表单还是注册表单进行的校验 避免出现的提示信息错误
      if (res.data.error === (flag ? 10001 : ERR_OK)) {
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
  checkExist({'name': value}).then(res => {
    if (res.data.error !== ERR_OK) {
      callback(new Error('该昵称已被占用'))
    } else {
      callback()
    }
  })
}

// 检测邮箱是否规范
export const _checkEmail = flag => {
  return (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入邮箱地址'))
    } else if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
      return callback(new Error('请输入正确的邮箱地址'))
    }

    checkExist({'email': value}).then(res => {
      if (res.data.error === (flag ? 10001 : ERR_OK)) {
        callback(new Error(flag ? '该邮箱已被注册' : '该邮箱不存在'))
      } else {
        callback()
      }
    })
  }
}

// 检测手机号码是否规范
export const _checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号码'))
  } else if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(value)) {
    return callback(new Error('请输入正确的手机号码'))
  }

  checkExist({'phone': value}).then(res => {
    if (res.data.error !== ERR_OK) {
      callback(new Error('该手机号码已被注册'))
    } else {
      callback()
    }
  })
}

// 检测分类名称是否规范
export const _checkTypeName = (rule, value, callback) => {
  // 判断分类名称是否为空
  if (!value) {
    return callback(new Error('请输入分类名称'))
  } else if (value.length > 5) {
    return callback(new Error('名称长度要小于5个字符'))
  }

  // 查询分类名称是否存在
  checkTypeName(value).then(res => {
    if (res.data.error !== ERR_OK) {
      callback(new Error('该分类名称已存在'))
    } else {
      callback()
    }
  })
}

export const _checkVideoName = (rule, value, callback) => {
  // 判断视频名称是否为空
  if (!value) {
    return callback(new Error('请输入视频名称'))
  }

  // 查询分类名称是否存在
  checkVideoExist({'name': value}).then(res => {
    if (res.data.error !== ERR_OK) {
      callback(new Error('该视频名称已存在'))
    } else {
      callback()
    }
  })
}
