// 登录拦截
exports.loginIntercept = async (ctx, next) => {
  let user = ctx.session.user
  if (user) {
    // 如果用户已登录 则继续执行下面的中间件
    await next()
  } else {
    ctx.body = {
      error: 10002,
      msg: '当前未登录'
    }
  }
}
