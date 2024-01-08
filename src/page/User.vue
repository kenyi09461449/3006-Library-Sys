<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="query.username" placeholder="Student number" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.nickname" placeholder="Please enter your name" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.status" placeholder="Please select a status" clearable>
            <el-option label="Enable" :value="0"></el-option>
            <el-option label="Freeze" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" round>Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleAdd" icon="el-icon-circle-plus-outline" round>Add new</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border stripe class="table">
        <el-table-column v-if="false" prop="id" label="ID" sortable />
        <el-table-column prop="username" label="Student number" />
        <el-table-column prop="nickname" label="Name" />
        <el-table-column prop="email" label="Gender">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.sex === 0 ? "Male" : "Female"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="Birthday" width="100" />
        <el-table-column prop="telephone" label="Phone" width="100" />
        <el-table-column prop="email" label="Email" width="100" />
        <el-table-column prop="profession" label="Profession" width="100" />
        <el-table-column prop="address" label="Address" width="150" />
        <el-table-column prop="amount" label="Amount" width="150" />
        <el-table-column prop="status" label="Status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1" @change="handelStatus($event,scope.row.id,)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="Create time" width="160"></el-table-column>
        <el-table-column label="Operate" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button type="text" icon="fa fa-cny" class="warning" @click="handleInvest(scope.row)">Recharge</el-button>
            <el-button type="text" icon="el-icon-delete" class="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageNum" :page-sizes="[5, 10, 20]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 添加弹窗 -->
    <!-- Add window popup -->
    <el-dialog :visible.sync="userDialog.dialogVisible" width="50%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{userDialog.dialogTitle}}
      </span>
      <el-form :model="userDialog.form" :rules="userDialog.rules" ref="form" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="Student number" prop="username">
              <el-input v-model="userDialog.form.username" placeholder="Please enter student number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="password" prop="password">
              <el-input type="password" v-model="userDialog.form.password" placeholder="Enter password" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="Name" prop="nickname">
              <el-input v-model="userDialog.form.nickname" placeholder="Enter student name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Gender" prop="sex">
              <el-radio v-model="userDialog.form.sex" :label="0">Male</el-radio>
              <el-radio v-model="userDialog.form.sex" :label="1">Female</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="Birthday" prop="birthday">
              <el-date-picker v-model="userDialog.form.birthday" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="Please select birthday" style="width:100%" autocomplete="off">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Phone" prop="telephone">
              <el-input v-model="userDialog.form.telephone" placeholder="Enter phone number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="userDialog.form.email" placeholder="Enter email number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Profession" prop="profession">
              <el-input v-model="userDialog.form.profession" placeholder="Enter profession" autocomplete="off"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="24">
            <el-form-item label="Address" prop="address">
              <el-input type="textarea" v-model.lazy="userDialog.form.address" placeholder="Please enter address" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialog.dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="save" round>Yes</el-button>
      </span>
    </el-dialog>

    <!-- 充值 -->
    <!-- Recharge -->
    <el-dialog :visible.sync="investDialog.dialogVisible" width="25%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{investDialog.dialogTitle}}
      </span>
      <el-form :model="investDialog.form" :rules="investDialog.rules" ref="investForm" label-position="right" label-width="80px">
        <el-form-item label="Recharge amount" prop="investAmount">
          <el-input v-model.number="investDialog.form.investAmount" placeholder="Recharge amount" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="investDialog.dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="handleInvestSave" round>Yes</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      loading: true,
      query: {
        username: '',
        nickname: '',
        status: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      userDialog: {
        dialogVisible: false,
        dialogTitle: '',
        form: {},
        rules: {
          username: [
            { required: true, message: 'Please enter the student number', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please enter the password', trigger: 'blur' }
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
            { required: true, message: 'Please enter email', trigger: 'blur' }
          ],
          profession: [
            { required: true, message: 'Please enter the major', trigger: 'blur' }
          ],
          address: [
            { required: true, message: 'Please enter the address', trigger: 'blur' }
          ],
        }
      },
      investDialog: {
        form: {},
        dialogVisible: false,
        dialogTitle: '',
        rules: {
          investAmount: [
            { required: true, message: 'Please enter the recharge amount', trigger: 'blur' }
          ]
        }
      }
    };
  },
  created() {
    this.load();
  },
  methods: {
    // 获取table数据
    //Get table data
    load() {
      this.loading = true
      this.$http.get("/user", {
        params: this.query
      }).then(res => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },

    // Search
    //Search
    handleSearch() {
      this.$set(this.query, 'pageNum', 1);
      this.load();
    },

    // 添加操作
    //Add new
    handleAdd() {
      this.userDialog.dialogTitle = "Add new user"
      this.userDialog.form = { 'sex': 0 }
      this.userDialog.dialogVisible = true;
      this.$nextTick(() => {
        //清除提示
        this.$refs.form.clearValidate();
      })
    },

    // 编辑操作
    //Edit
    handleEdit(row) {
      this.userDialog.dialogTitle = "Edit user infor"
      this.userDialog.form = row;
      this.userDialog.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },


    //点击充值事件
    //'Recharge' event
    handleInvest(row) {
      this.investDialog.dialogTitle = 'Recharge'
      this.investDialog.form = { "id": row.id, "amount": row.amount }
      this.investDialog.dialogVisible = true
      this.$nextTick(() => {
        
        this.$refs['form'].clearValidate();
      })
    },

    // 保存
    //Save
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.userDialog.form.id) {  
            // 更新
            //Update
            this.$http.put("/user", this.userDialog.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load()
                this.userDialog.dialogVisible = false
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }

            })
          } else {  
            // 新增
            //Add new
            this.$http.post("/user", this.userDialog.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load()
                this.userDialog.dialogVisible = false
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },


    //充值弹窗点击保存事件
    //Save of recahrge window
    handleInvestSave() {
      // 表单验证
      //Form validation
      this.$refs['investForm'].validate((valid) => {
        if (valid) {
          const totalAmount = this.investDialog.form.amount + this.investDialog.form.investAmount
          this.$http.put("/user/invest", { "id": this.investDialog.form.id, "amount": totalAmount }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "Recharged successfully!"
              })
              this.load()
              this.investDialog.dialogVisible = false
            } else {
              this.$message({
                type: "error",
                message: res.msg
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },


    // 删除操作
    //Delete
    handleDelete(row) {
      // 二次确认
      //Secondary confirmation
      this.$confirm('Are you sure you want to delete it?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/user/" + row.id).then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: res.msg
            })
            this.load()
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        })
      })
    },

    //状态切换
    //Change status
    handelStatus(value, id) {
      this.$http.put("/user/status", { "id": id, "status": value }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.msg
          })
          this.load() 
          this.dialogVisible = false  
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }

      })
    },

    // 切换每页几条
    //Switch how many items per page
    handleSizeChange(pageSize) {
      this.$set(this.query, 'pageSize', pageSize);
      this.load()
    },

    // 分页导航
    //Paginated navigation
    handleCurrentChange(val) {
      this.$set(this.query, 'pageNum', val);
      this.load();
    }


  }
};
</script>
