const fs = require('fs')
const path = require('path')

module.exports = {
  deleteFile (src) { // 删除文件
    let vSrc = path.join(__dirname, '../', '/public' + src)
    if (fs.existsSync(vSrc)) {
      fs.unlinkSync(vSrc)
    }
  }
}
