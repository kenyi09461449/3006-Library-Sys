var Tools = require('./tools')
// 联系人列表
//Contact list
var concats = {
  body: [],
  onLine: {}
}


var chat = (io) => {
  io.on('connection', function(socket) {
    // 登录
    //Login
    socket.on('LOGIN', function(res) {
      console.log('Socket server receives login message',res);
      // socket ID
      let id = socket.id
      console.log('id=====>:',id);

      let body = res.body
      let nickname = body.nickname
      // 修改时间
      //Change time
      body.message.time = Tools.dateTime()

      // 登录成功
      //Login succeeded
      concats.onLine[body.id] = socket;

      setTimeout(() => {
        /**
         * 发送联系人列表给客户端
         * Send contact list to client
         */
        socket.emit('conCats', {
          code: 2,
          body: concats.body
        })
        
        // 有人进入聊天室
        //Someone entered the chat room
        body.notify = nickname + 'You have entered the chatroom'
        io.emit('onLine', {
          code: 2,
          body: body,
          lineCount: Tools.getLineCount(concats) + 1
        })

        // 删除通知字段
        //Delete notification field
        delete body.notify
        // 插入联系人列表
        //Insert contact list
        concats.body.push(body)
      },1000)

  
    })
  
    /**
     * 用户断开
     * User disconnected
     */
    socket.on('disconnect', function() {
      let id = socket.id
      // 删除断开用户
      //Delete disconnected user
      Object.keys(concats.onLine).forEach(key => {
          var so = concats.onLine[key];
          if(socket.id == so.id){
            // 获取当前离开用户信息
            //Get information about the current departing user
            var user = null;
            concats.body.map((item, k) => {
              if(item.id == key) {
                user = item;
                // 删除好友列表
                //Delete friend list
                concats.body.splice(k, 1)
              }
            })
            // 删除在线人员
            //Delete online personnel
            delete concats.onLine[key]
            // 告诉客户端有人跑了
            //Tell the client that someone has left
            io.emit('onLine', {
              code: 1,
              body: {
                id: user.id,
                avatar: user.avatar,
                nickname: user.nickname,
                notify: user.nickname + 'Leave the chatroom'
              },
              lineCount: Tools.getLineCount(concats)
            })
          }
      });
      
    })
    
    /**
     * 接收消息
     * Receive messages
     */
    socket.on('MESSAGE', function(message) {

      try{
        let type = message.type
        let body = message.body
        let gotoId = body.gotoId
        let fromId = body.fromId
        message.type = 'server-message'
        message.body.type = 'server'
    
        if (type == 'group-message'){ // 群聊//Group chat
          io.emit('MESSAGE', message)
        } else { // 一对一聊天//One-on-one chat
          message.id = fromId
          message.body.fromId = gotoId
          message.body.gotoId = fromId
          concats.onLine[gotoId].emit('MESSAGE', message)
        }
      }catch(e){
        console.log(e)
      }
      
    })
  
    
  })
}

module.exports = {
  chat
}
