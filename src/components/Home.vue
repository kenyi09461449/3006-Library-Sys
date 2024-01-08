<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
        <el-backtop target=".content"></el-backtop>
      </div>
    </div>

    <el-tooltip effect="dark" content="Chat" placement="bottom" v-if="user.role == 1">
      <el-button type="danger" size="medium" icon="el-icon-chat-line-round" class="item" circle @click="chatOnline"></el-button>
    </el-tooltip>

    <el-drawer :visible.sync="drawer" direction="rtl" size="78%">
      <span slot="title">
        <i class="el-icon-chat-line-round chat-icon"></i> Chat
      </span>
      <div class="chat">
        <el-container>
          <el-aside width="250px">
            <el-header height="40px">
              <i class="el-icon-user icon-message"></i>
              <span class="title">Contacts</span>
            </el-header>
            <message-group :concats="concats" @switchGroup="switchGroup" />
          </el-aside>
          <el-main>
            <el-header height="40px">
              <span class="title" v-if="concats[nowSwitch].id == 0">Chat({{lineCount}})Online</span>
              <span class=" title" v-else>{{concats[nowSwitch].nickname}}</span>
            </el-header>

            <message-pabel :concats="concats" :nowSwitchId="nowSwitchId" @message="message" />

            <message-input :concats="concats" :nowSwitchId="nowSwitchId" />
          </el-main>
          <footer class="footer">
            <a href="https://xiaobaicai.fun/" target="_blank">WeiLin</a> &copy; 2020
          </footer>
        </el-container>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import MessageGroup from '@/page/chat/message-group'
import MessagePabel from '@/page/chat/message-pabel'
import MessageInput from '@/page/chat/message-input'
export default {
  name: 'Home',
  data() {
    return {
      user: this.$store.state.user,
      tagsList: [],
      drawer: false,
      lineCount: 0,
      concats: [{
        id: 'group',
        active: false,
        nickname: 'Study group',
        avatar: require('@/assets/images/avatar/group.png'),
        message: {
          time: 1580572800000,
          content: 'Welcome to group chat'
        }
      }],
      nowSwitch: 0,
      nowSwitchId: 'group',
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags,
    MessageGroup,
    MessagePabel,
    MessageInput
  },
  mounted() {

 

    
    //获取联系人信息
    //Get contact information
    this.sockets.subscribe('conCats', res => {
      console.log('客户端conCats===>', res.body);
      let body = res.body

      // 默认选中第一个
      //Select the first one by default
      body.map(item => {
        item.active = false
      })
      this.concats = this.concats.concat(body);
      console.log('this.concats===>', this.concats)
      this.concats[0].active = true
      this.nowSwitchId = 'group'
    })

    
    //获取在线人数及通知
    //Get the number of people online and notifications
    this.sockets.subscribe('onLine', res => {
      console.log('Client OnLine===>', res);
      let code = res.code
      let body = res.body
      let notify = code === 2 ? 'Welcome:)' : ':)'
      this.$notify({
        title: 'Notification',
        dangerouslyUseHTMLString: true,
        message: `
          <img class="notify-image" src="${body.avatar}">
          <div class="notify-content">
            <strong class="notify-title">${notify}</strong>
            <span><strong> ${body.notify} </strong</span>
          </div>
        `
      })

      // 删除通知
      //Delete notification
      delete body.notify

      // 在线人数
      //Number of online users
      this.lineCount = res.lineCount

      // 添加联系人
      //Add contact
      if (code === 2) {
        if (body.id != "S" + this.user.id) {
          this.concats.push(body)
        }
      } else {

        // 如果当前选择的人离开了就选中聊天室
        //If the currently selected person is offline, switch to the chat room
        if (body.id === this.nowSwitchId) {
          this.concats[0].active = true
          this.nowSwitch = 0
          this.nowSwitchId = 'group'
          this.concats[0].message.newMessageCount = 0
          this.concats[0].message.isNewMessage = false
        }

        // 删除联系人
        //delete contact
        for (let i = 0; i < this.concats.length; i++) {
          if (body.id === this.concats[i].id) {
            this.concats.splice(i, 1)
          }
        }
      }
    })
  },
  computed: {
    collapse() {
      return this.$store.state.collapse
    }
  },
  methods: {
    chatOnline() {
      this.drawer = true;
    },

    
    //切换聊天对象
    //Switch contacts
    switchGroup(index, id) {
      this.nowSwitchId = id
      this.nowSwitch = index

      // 隐藏小红点
      //Hide small red dots
      if (this.concats[index].message.isNewMessage !== undefined) {
        this.concats[index].message.isNewMessage = false
        this.concats[index].message.newMessageCount = 0
      }
    },

    //接收消息
    //Receive messages
    message(respone) {
      let type = respone.type
      let body = respone.body
      let concats = this.concats
      let length = concats.length
      let id = body.gotoId

      // 服务器返回的消息
      //Message returned by the server
      if (type === 'server-message') {
        if (respone.id === 'robots') {
          id = 'robots'
        }
      }

      // 更新小红点
      //Update small red dots
      if (this.nowSwitchId !== id) {
        body.message.isNewMessage = true
        body.message.newMessageCount = (() => {
          for (var i = 0; i < length; i++) {
            if (id === this.concats[i].id) {
              if (this.concats[i].message.newMessageCount !== undefined) {
                let count = this.concats[i].message.newMessageCount += 1
                return count
              } else {
                return 1
              }
            }
          }
        })()
      }

      // 更新联系人消息
      //Update contact messages
      for (let i = 0; i < length; i++) {
        if (concats[i].id === id) {
          Object.assign(this.concats[i].message, body.message)
        }
      }
    },


     //退出聊天
     //Exit chat
    goBack() {
      let href = window.location.href
      window.location.href = href.split('#')[0]
    }
  },
  beforeDestroy() {
    this.sockets.unsubscribe('conCats')
    this.sockets.unsubscribe('onLine')

  }
}
</script>
<style lang="scss" scoped>
.item {
  position: absolute;
  right: 35px;
  bottom: 20px;
  z-index: 1;
}

::v-deep .el-drawer__header {
  margin-bottom: 0;
}
.chat {
  padding: 20px;
  .el-container {
    border: 1px solid #eee;
    .el-aside,
    .el-main {
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      height: 520px;
    }
    .el-aside {
      background: rgba(235, 233, 232, 0.8);
    }
    .el-main {
      padding: 0;
      background: rgba(235, 233, 232, 0.8);
    }
    .el-header {
      position: relative;
      line-height: 40px;
      background: rgb(217 214 214);
      // background: rgb(55, 126, 200);
      border-bottom: 1px solid #eee;
      overflow: hidden;
      .icon-message {
        font-size: 20px;
        vertical-align: middle;
      }
      .title {
        display: inline-block;
        margin-left: 5px;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: -23px;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 13px;
    width: 150px;
    color: #ffffff;
    text-align: center;
    a {
      color: #ffffff;
      &:hover {
        color: #377ec8;
      }
    }
  }
}
.chat-icon {
  font-size: 20px;
  vertical-align: middle;
  margin-top: -2px;
}
</style>