<template>
  <div style="padding: 10px">
    <el-row>
      <el-col :span="9">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Personal information</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="Username" prop="username">
              <el-input v-model="form.username" placeholder="Please input Student number" disabled></el-input>
            </el-form-item>
            <el-form-item label="Nickname" prop="nickname">
              <el-input v-model="form.nickname" placeholder="Please input your name"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="update" round>Save</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AdminProfile",
  data() {
    return {
      user: this.$store.state.user,
      form: {},
      rules: {
        username: [
          { required: true, message: 'Please input Student number', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: 'Please input your name', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.initProfile();
  },
  methods: {
    //初始化
    //Initialize
    initProfile() {
      this.$http.get('/admin/' + this.user.id).then(res => {
        if (res.code === 200) {
          this.form = res.data
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },

    //更新个人信息
    //Update personal information
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.put("/admin", this.form).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "Update success"
              })
              this.user.nickname = this.form.nickname
              localStorage.setItem("user", JSON.stringify(this.user))
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