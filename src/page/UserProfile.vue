<template>
  <div style="padding: 10px">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Personal Infor</span>
          </div>
          <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Student number" prop="username">
                  <el-input v-model="form.username" placeholder="Student number" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="Name" prop="nickname">
                  <el-input v-model="form.nickname" placeholder="Name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Gender" prop="sex">
                  <el-radio v-model="form.sex" :label="0">Male</el-radio>
                  <el-radio v-model="form.sex" :label="1">Female</el-radio>
                </el-form-item>
                <el-form-item label="Birthday" prop="birthday">
                  <el-date-picker v-model="form.birthday" type="date" placeholder="Select birthday" style="width:100%" autocomplete="off">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="Phone" prop="telephone">
                  <el-input v-model="form.telephone" placeholder="Phone number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                  <el-input v-model="form.email" placeholder="Email number" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Avatar" prop="avatar">
                  <el-upload class="avatar-uploader" action="http://localhost:8080/upload/1" :show-file-list="false" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
                    <img v-if="form.avatar" :src="form.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="Profession" prop="profession">
                  <el-input v-model="form.profession" placeholder="profession" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Account balance" prop="amount">
                  <el-input v-model="form.amount" placeholder="Account balance" autocomplete="off" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Address" prop="address">
                  <el-input type="textarea" v-model="form.address" placeholder="Address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-button type="primary" @click="update" round>Save</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>

</template>

<script>
export default {
  name: "UserProfile",
  data() {
    return {
      user: this.$store.state.user,
      form: {},
      collegeList: [],
      rules: {
        username: [
          { required: true, message: 'Please enter the student number', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: 'Please enter the student name', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: 'Please select gender', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: 'Please select birthday', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: 'Please enter phone number', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter email number', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: 'Please upload your profile picture', trigger: 'blur' }
        ],
        profession: [
          { required: true, message: 'Please enter the major', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Please enter the address', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.initProfile();
    this.loadCollege()
  },
  methods: {

    //初始化信息
    //Initialization information
    initProfile() {
      this.$http.get('/user/info/' + this.user.id).then(res => {
        if (res.code === 200) {
          this.form = res.data;
          this.getClazeByGrade();
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
          this.$http.put("/user", this.form).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "Upadte successed"
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

    },

    //el-upload图片上传回调
    //El upload image upload callback
    handleUploadSuccess(res, file) {
      this.$set(this.form, "avatar", res.data)
      this.$message.success("Upload successed")
    },

    //图片上传前校验
    //Verify before uploading images
    beforeUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('Only JPG format!');
      }
      if (!isLt2M) {
        this.$message.error('The image should be less than 2mb 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

