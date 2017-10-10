const Koa = require('koa')
const app = new Koa()
const index = require('./index')
const users = require('./users')

module.exports = app => {
  app.use(index.routes(), index.allowedMethods())
  app.use(users.routes(), users.allowedMethods())
}
