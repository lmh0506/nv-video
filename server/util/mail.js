const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
const config = require('../config/index')

smtpTransport = nodemailer.createTransport(smtpTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
}))

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail({
      from: config.email.user,
      to: recipient,
      subject: subject,
      html: html

    }, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = sendMail
