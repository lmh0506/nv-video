const users = require('./users')
const videoType = require('./videoType')
const video = require('./video')
const comment = require('./comment')

module.exports = app => {
  app.use(users.routes(), users.allowedMethods())
  app.use(videoType.routes(), videoType.allowedMethods())
  app.use(video.routes(), video.allowedMethods())
  app.use(comment.routes(), comment.allowedMethods())
}
