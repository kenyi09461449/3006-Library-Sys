<template>
  <div>
    <el-row>
      <el-col :span="9">
        <el-card>
          <div slot="header" class="clearfix">
            <span>Change password</span>
          </div>
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="Old password" prop="oldpwd">
              <el-input v-model="form.oldpwd" show-password placeholder="Please enter the old password"></el-input>
            </el-form-item>
            <el-form-item label="New password" prop="password">
              <el-input v-model="form.password" show-password placeholder="Please enter new password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm password" prop="repetpwd">
              <el-input v-model="form.repetpwd" show-password placeholder="Please enter confirm password"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="changePsss" round>Save</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Password",
  data() {
    return {
      form: {
        oldpwd: '',
        password: '',
        repetpwd: ''
      },
      rules: {
        oldpwd: [
          { required: true, message: 'Please enter the password', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please enter the new password', trigger: 'blur' },
        ],
        repetpwd: [
          { required: true, message: 'Please enter confirm password', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    changePsss() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.password != this.form.repetpwd) {
            this.$message.error('The new password and confirmed password must same')
            return
          }
          let user = JSON.parse(localStorage.getItem("user"))
          if (this.form.oldpwd != user.password) {
            this.$message.error('Wrong old password')
            return
          }
          this.form.id = user.id
          let url
          if (user.role === 0) {
            url = '/admin/password'
          } else {
            url = '/user/password'
          }
          this.$http.put(url, this.form).then(res => {
            if (res.code === 200) {
              this.$message.success('Password modification successful, relogin to takes effect')
              this.$store.commit('LOGOUT')
              this.$router.push('/login');
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
