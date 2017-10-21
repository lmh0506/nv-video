const index = require('./index')
const users = require('./users')
const videoType = require('./videoType')
const video = require('./video')

module.exports = app => {
  app.use(index.routes(), index.allowedMethods())
  app.use(users.routes(), users.allowedMethods())
  app.use(videoType.routes(), videoType.allowedMethods())
  app.use(video.routes(), video.allowedMethods())
}
