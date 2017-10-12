const router = require('koa-router')()
router.prefix('/api/user')

router.get('/', async (ctx, next) => {
  ctx.body = {
    error: 0,
    msg: ''
  }
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
