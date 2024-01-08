//返回底部
//Return to bottom
function gotoBottom () {
  const box = document.getElementsByClassName('message-pabel-box')[0]

  this.$nextTick(() => {
    box.scrollTop = box.scrollHeight
  })
}

export {
  gotoBottom
}
