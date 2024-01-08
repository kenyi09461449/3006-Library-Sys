<template>
  <div class="header">
    <div class="logo" :class="!collapse ? '':'collapse'">
      <img src="@/assets/images/logo.png" />
      <h2 v-if="!collapse">Library System</h2>
    </div>

    <!-- 折叠按钮 -->
    <!-- Fold button -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="header-right">
      <div class="header-user-con">

        <!-- 全屏显示 -->
        <!--Full screen display-->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`Exit fullscreen`:`Fullscreen`" placement="bottom">
            <i class="el-icon-full-screen"></i>
          </el-tooltip>
        </div>

        <!-- 聊天 -->
        <!-- Chat -->

        <!-- 用户名下拉菜单 -->
        <!-- User name dropdown menu -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{user.nickname}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-edit-outline" command="profile">Personal Infor</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="password">Change password</el-dropdown-item>
            <el-dropdown-item icon="el-icon-warning-outline" command="logout">Log out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

  </div>

</template>
<script>
export default {
  name: 'Header',
  data() {
    return {
      fullscreen: false,
      user: this.$store.state.user,

    };
  },
  computed: {
    collapse() {
      return this.$store.state.collapse
    },
  },
  methods: {
    // 侧边栏折叠
    //Folding sidebar
    collapseChage() {
      this.$store.commit('SET_COLLAPSE')
    },
    // 全屏事件
    //Fullscreen function
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    //处理下拉菜单
    handleCommand(command) {
      if (command == 'profile') {
        if (this.user.role == 0) {
          this.$router.push('/admin/profile')
        } else {
          this.$router.push('/user/profile')
        }
      } else if (command == 'password') {
        this.$router.push('/password')
      } else if (command == 'logout') {
        this.$store.commit('LOGOUT')
        this.$router.push('/login');
        this.$store.commit('LOGOUT')
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  border-bottom: solid 1px #e6e6e6;
  box-shadow: 0 5px 10px #ddd;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border-right: solid 1px #e6e6e6;
}

.collapse {
  width: 64px !important;
}

.collapse img {
  margin-right: 0 !important;
}

.header .logo h2 {
  display: inline-block;
  font-size: 18px;
}

.header .logo img {
  width: 35px;
  height: 35px;
  vertical-align: middle;
  margin-right: 4px;
}

.header-right {
  float: right;
  padding-right: 20px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-chat {
  margin-right: 15px;
  font-size: 18px;
  cursor: pointer;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
}

.user-name {
  margin-left: 30px;
}

.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
