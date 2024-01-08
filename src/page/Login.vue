<template>
  <div class="login-wrap">
    <div class="login-top">
      <h2><img src="@/assets/images/logo.png">Library system</h2>
    </div>
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/images/login-bg.png">
      </div>
      <div class="login-right">
        <div class="login-title">System login</div>
        <el-form ref="form" :model="form" size="medium" :rules="rules" label-width="0px" class="login-content">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user-solid" type="text" v-model="form.username" placeholder="username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="form.password" show-password placeholder="Password" autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="form.role">
              <el-radio :label="0">Admin</el-radio>
              <el-radio :label="1">Student</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div style="display:flex">
              <el-input prefix-icon="el-icon-key" @keydown.enter.native="login" v-model="form.validCode" style="width: 60%;" placeholder="ValidCode"></el-input>
              <ValidCode @input="createValidCode" />
            </div>
          </el-form-item>
          <el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="login" round>Login</el-button>
            </div>
          </el-form-item>

        </el-form>
      </div>

    </div>
  </div>

</template>

<script>
import ValidCode from "@/components/ValidCode";

export default {
  name: "Login",
  components: {
    ValidCode,
  },
  data() {
    return {
      form: {
        role: 0,
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
        ],
      },
      validCode: ''
    }
  },
  mounted() {
    sessionStorage.removeItem("user")
  },
  methods: {
    // 接收验证码组件提交的 4位验证码
    //Receive 4-digit verification code submitted by the verification code component
    createValidCode(data) {
      this.validCode = data
    },
    login() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.validCode) {
            this.$message.error("Please fill in the verification code")
            return
          }
          if (this.form.validCode.toLowerCase() !== this.validCode.toLowerCase()) {
            this.$message.error("Wrong code")
            return
          }
          this.$http.post("/login", this.form).then(res => {
            if (res.code === 200) {
              var user = res.data;
              this.$message({
                type: "success",
                message: "Login succeeded"
              })
              this.$store.commit('LOGIN', user)
              if (user.role != 0) {
                // 发送登录消息
                //Send login message
                this.$socket.emit('LOGIN', {
                  type: 'onLine',
                  body: {
                    id: "S" + user.id,
                    avatar: user.avatar ? user.avatar : require("@/assets/images/avatar/avatar.jpg"),
                    nickname: user.nickname,
                    message: {
                      content: '',
                      time: +new Date()
                    }
                  }
                })
              }
              
              this.$router.push('/')
            } else {
              this.$message({
                type: "error",
                message: res.msg
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to left, rgb(211 97 219), rgb(33 32 118));
}

.login-top {
  background: #fff;
}

.login-top h2 {
  height: 60px;
  margin-left: 20px;
  line-height: 60px;
  font-size: 20px;
}

.login-top h2 img {
  width: 35px;
  height: 35px;
  margin-right: 3px;
  vertical-align: middle;
  margin-top: -4px;
}

.login-box {
  overflow: hidden;
  width: 65%;
  margin: 70px auto;
  background: #fff;
  border-radius: 10px;
  height: 430px;
}

.login-left {
  float: left;
  width: 65%;
  height: 100%;
  border-right: 1px solid #eee;
}

.login-left img {
  width: 100%;
  height: 100%;
}
.login-right {
  width: 34%;
  min-height: 360px;
  max-width: 420px;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 30px;
  float: right;
}

.login-title {
  width: 100%;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
}

.login-content .el-form-item {
  margin-bottom: 20px;
}

.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.register {
  float: right;
  cursor: pointer;
  font-size: 12px;
  color: #409eff;
  display: block;
  height: 20px;
}
</style>
