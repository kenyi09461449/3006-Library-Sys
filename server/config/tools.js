

const Tools = {
  /**
   * 获取当前时间
   * Get current time
   */
  dateTime() {
    return new Date().getTime()
  },
  /**
   * 获取在线人数
   * Get the number of online users
   */
  getLineCount(concats) {
    return concats.body.length
  },
  
}

exports = module.exports = Tools
