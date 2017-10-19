const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body');
const logger = require('koa-logger')

const session = require('koa-session')

require('./models/connect')

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))

app.use(koaBody({multipart: true}));

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.keys = ['some secret hurr'];
app.use(session(app))

app.use(views(__dirname + '/views', {
  extension: 'html'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
require('./routes/router.js')(app)

module.exports = app
