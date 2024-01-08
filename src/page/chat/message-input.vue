<template>
  <div class="message-input-box">
    <div class="input-tools">
      <i slot="reference" class="fa fa-smile-o" title="Emoji"></i>
    </div>

    <el-input type="textarea" resize="none" :autosize="{ minRows: 5, maxRows: 5}" v-model="textArea" v-on:keyup.native="keyUp">
    </el-input>

    <div class="footer-tools">
      <el-button size="mini" type="primary" @click="sendMessage" class="send-button">Send</el-button>
    </div>
  </div>
</template>
<script>
import '../../assets/js/face.js'
import { gotoBottom } from '@/assets/js/tools'

export default {
  data() {
    return {
      user: this.$store.state.user,
      textArea: '',
      gotoBottom: gotoBottom
    }
  },
  props: {
    // 联系人列表
    //contacts list
    concats: {
      type: Array
    },
    // 当前选择的ID
    //The currently selected contact ID
    nowSwitchId: {
      type: String
    },
  },
  mounted() {
    // 表情
    //Emoji
    this.obj = new window.Face({
      el: document.querySelector('.fa-smile-o'),
      callBack: face => {
        this.textArea += `〖${face.title}〗`
        document.querySelector('.face-warp').style.display = 'none'
      }
    })
  },
  methods: {
    //消息类型
    //Message type
    nowSwitchType() {
      if (this.nowSwitchId === 'group') {
        return 'group-message'
      } else {
        return 'user-message'
      }
    },

     //消息过滤
     //Message Filtering

    textAreaTran() {
      return this.textArea.replace(/\n/g, '').replace(new RegExp('<', 'gm'), '&lt')
    },

    //检测发送信息是否为空白
    //Check if the sent message is blank
    blankTesting() {
      if (this.textArea.replace(/\s+/g, '') === '') {
        this.$alert('Cannot send blank messages', 'Prompt', {
          confirmButtonText: 'Yes'
        })
        return false
      }
      return true
    },

    
     //按Enter发送消息
     //Press 'Enter' key to send message
    keyUp(event) {
      if (event.key === 'Enter') {
        this.sendMessage()
      }
    },

    
     //发送消息
     //Send message
    sendMessage() {
      let message = {
        type: this.nowSwitchType(),
        // 发送者ID
        // Sender ID
        id: "S" + this.user.id,
        body: {
          // 消息类型
          //Message type
          type: 'user-message',
          // 收者ID
          //Receiver ID
          gotoId: this.nowSwitchId,
          // 发送者ID
          //Sender ID
          fromId: "S" + this.user.id,
          // 发送者头像
          //Sender avatar
          avatar: this.user.avatar ? this.user.avatar : require("@/assets/images/avatar/avatar.jpg"),
          // 发送者昵称
          //Sender nickname
          nickname: this.user.nickname,
          message: {
            // 发送时间
            //send time
            time: +new Date(),
            // 内容带标签
            //Content with lable
            content: this.obj.replaceFace(this.textAreaTran()),
            // 纯内容不带标签
            //Content without lable
            textContent: this.textAreaTran()
          }
        }
      }
      if (this.blankTesting()) {
        // 发送服务器
        //Sending server
        this.$socket.emit('MESSAGE', message)
        // 传递至同级
        //Transferred to peers
        this.$bus.$emit('MESSAGE', message)
        // 消息清空
        //Clear message
        this.textArea = ''
        // 消息置底
        //Bottom message
        this.gotoBottom()
      }
    }
  }
}
</script>

<style lang="scss">
.message-input-box {
  height: 180px;
  background-color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid #eee;
  .input-tools {
    position: relative;
    padding: 6px 10px;
    border-bottom: 1px solid #eee;
    .upload-demo {
      display: inline;
    }
    i {
      color: rgb(94, 94, 94);
      font-size: 20px;
      cursor: pointer;
    }
  }
  .el-textarea {
    .el-textarea__inner {
      padding: 5px 20px;
      border-radius: 0;
      border: 0;
      background-color: transparent;
    }
  }
  .footer-tools {
    text-align: right;
    .send-button {
      padding: 7px 10px;
      margin-right: 20px;
      background: #377ec8;
    }
  }
}
.face-pabel {
  .face {
    display: inline-block;
    width: 20px;
    height: 20px;
  }
}
</style>
