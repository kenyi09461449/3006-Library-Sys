<template>
  <div class="message-pabel-box">

    <el-button class="eye-more" @click="eyeMore" v-if="nowSwitchId == 0 && isShowMore" type="text">Load more messages</el-button>

    <ul class="message-styles-box">
      <li v-for="(item, index) in messageTemplate()" :key="index" :class="judgeClass(item.type)">

        <img class="message-avatar" :src="item.avatar" :alt="item.nickname ? item.nickname : 'Tom'">

        <p class="message-nickname" v-if="item.type == 'server'">{{item.nickname}} {{formatTime(item.message.time)}}</p>
        <p class="message-nickname" v-else>{{formatTime(item.message.time)}} {{item.nickname}}</p>
        <p class="message-classic" v-html="item.message.content"></p>
      </li>
    </ul>
  </div>
</template>

<script>
import { gotoBottom } from '@/assets/js/tools'

export default {
  name: 'MessagePabel',
  props: {
    // 选择的联系人ID
    //Selected contact ID
    nowSwitchId: {
      type: String
    },
    concats: {
      type: Array
    }
  },
  data() {
    return {
      user: this.$store.state.user,
      message: {},
      test: {},
      page: 0,
      isShowMore: true,
      gotoBottom: gotoBottom
    }
  },
  mounted() {

    //接收消息
    //Recive message
    this.sockets.subscribe('MESSAGE', message => {
      let id = message.id
      let gotoId = message.body.gotoId
      let fromId = message.body.fromId
      let content = message.body.message.content
      console.log('fromId=======>', fromId)
      console.log('gotoId=======>', gotoId)
      console.log('content=======>', content)

      message.body.message.content = content.replace(/[{]/g, '<').replace(/[}]/g, '>')

      this.initMessageArray(gotoId, fromId)

      // 用户在群聊发消息
      // User send message in group 
      if (gotoId === 'group' && fromId === "S" + this.user.id) {
        message.body.type = 'user-message'
      }

      if (gotoId === 'group') {
        this.message['group'].push(message.body)
      } else {
        this.message[id].push(message.body)
      }
      console.log('this.message======>', this.message);
      this.$forceUpdate()
      this.gotoBottom()
      // 把消息传给父级
      //Pass the message to the parent level
      this.$emit('message', message)
    })

     //当前用户发的消息
     //Messages sent by the current user
    this.$bus.$on('MESSAGE', response => {
      let body = response.body
      let gotoId = body.gotoId
      let fromId = body.fromId

      this.initMessageArray(gotoId, fromId)

      // 自己给自己发消息
      //Send yourself a message
      if (gotoId === fromId) {
        this.message[fromId].push(body)
      } else if (response.type === 'robots-message' || response.type === 'user-message') {
        this.message[gotoId].push(body)
      }
      this.$forceUpdate()
      // 把消息传给父级
      //Pass the message to the parent level
      this.$emit('message', response)
    })

    //接收更多消息
    //Recive more messages
    this.sockets.subscribe('GROUP_MESSAGE', result => {
      const box = document.getElementsByClassName('message-pabel-box')[0]
      const scroll = box.scrollHeight - box.scrollTop

      // 是否有更多数据
      //Whether or not have more data
      if (result.length) {
        result.map((item, index) => {
          this.message['group'].unshift(JSON.parse(item.body))
        })
      } else {
        this.isShowMore = false
      }

      if (result.length < 9) this.isShowMore = false

      setTimeout(() => {
        box.scrollTop = box.scrollHeight - scroll
      }, 0)

      this.$forceUpdate()
    })
  },
  methods: {
    //数组初始化
    //Array Initialization
    initMessageArray(gotoId, fromId) {
      let array = this.message

      if (!gotoId) return
      if (!array[gotoId]) {
        this.message[gotoId] = []
      }

      if (!fromId) return
      if (!array[fromId]) {
        this.message[fromId] = []
      }
    },


    //判断Class
    //Determine Class
    judgeClass(type) {
      if (type === 'server') {
        return 'message-layout-left'
      } else {
        return 'message-layout-right'
      }
    },


    //返回聊天记录集合
    //Return to chat record collection
    messageTemplate() {
      return this.message[this.nowSwitchId]
    },

    //查看更多
    //See more
    eyeMore() {
      let obj = {
        id: this.localInfo.id,
        page: this.page += 1
      }
      this.initMessageArray('group')
      if (this.message['group'] !== undefined && this.page === 1) {
        obj.length = this.message['group'].length
      }
      // 发送查询消息
      // Send query message
      this.$socket.emit('QUERY_PAGE', obj)
    },
    /**
     * 获取年月日
     */
    //获取年月日
    //Get Year Month Day
    formatFullYearMonthDay(date, isShowHourMinute, type) {
      date = new Date(date)
      const fullYear = date.getFullYear()
      const month = date.getMonth() + 1
      const dayDate = date.getDate()
      var hours = date.getHours()
      var minutes = date.getMinutes()

      if (isShowHourMinute) {
        return `${fullYear}${month}${dayDate}${hours}${minutes}`
      } else {
        if (type) {
          return `${fullYear}${type}${month}${type}${dayDate}`
        } else {
          return `${fullYear}${month}${dayDate}`
        }
      }
    },

    //时间格式化
    //Time formatting
    formatTime(time) {
      var date = new Date(time)
      var nowDate = new Date()
      var hours = date.getHours()
      var minutes = date.getMinutes()

      hours = hours < 10 ? `0${hours}` : hours
      minutes = minutes < 10 ? `0${minutes}` : minutes

      if (this.formatFullYearMonthDay(date) === this.formatFullYearMonthDay(nowDate)) {
        return `${hours}:${minutes}`
      } else {
        return `${this.formatFullYearMonthDay(date, false, '/')} ${hours}:${minutes}`
      }
    }
  },
  beforeDestroy() {
    this.sockets.unsubscribe('MESSAGE')
    this.sockets.unsubscribe('GROUP_MESSAGE')

  }
}
</script>

<style lang="scss">
.message-pabel-box {
  padding: 0 20px;
  overflow-y: auto;
  height: 300px;
  -webkit-overflow-scrolling: touch;
  background: rgb(239 237 237);

  .eye-more {
    width: 100%;
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
  }

  .message-styles-box {
    margin-bottom: 20px;
    .message-layout-left,
    .message-layout-right {
      margin-top: 20px;
      width: 100%;
      .message-classic::before {
        content: "";
        position: absolute;
        border-width: 8px;
        border-style: solid;
      }
    }

    .message-layout-left {
      .message-avatar {
        float: left;
        margin-right: 10px;
      }
      .message-classic {
        background-color: rgba(255, 255, 255, 0.8);
        &::before {
          left: -16px;
          border-color: transparent rgba(255, 255, 255, 0.8) transparent
            transparent;
        }
      }
    }

    .message-layout-right {
      text-align: right;
      .message-avatar {
        float: right;
        margin-left: 10px;
      }
      .message-classic {
        text-align: left;
        color: #ffffff;
        background-color: rgba(55, 126, 200, 0.8);
        &::before {
          right: -16px;
          border-color: transparent transparent transparent
            rgba(55, 126, 200, 0.8);
        }
      }
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #eeeeee;
    }
    .message-nickname {
      color: #777777;
      font-size: 12px;
    }

    .message-classic {
      position: relative;
      max-width: 45%;
      margin-top: 5px;
      display: inline-block;
      padding: 9px 12px;
      font-size: 14px;
      color: #333333;
      border-radius: 5px;
      white-space: pre-line;
      word-wrap:break-word; 
     word-break:break-all;
    }
  }
}
</style>
