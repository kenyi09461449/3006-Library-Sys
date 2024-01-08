<template>
  <div style="word-wrap:normal;word-break:hyphenate;">
    <!-- Search框 -->
    <!-- Search box -->
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="query.title" placeholder="Please enter the title" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="el-icon-search" round>Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="add" icon="el-icon-circle-plus-outline" v-if="user.role != 0" round>Add new</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column v-if="false" prop="id" label="ID" sortable />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="user.nickname" label="Name" />
        <el-table-column prop="content" label="Content" />
        <el-table-column prop="status" label="Status">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status ==0">To be replied to</el-tag>
            <el-tag type="parimary" v-else>Replied</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reply" label="Reply">
          <template slot-scope="scope">
            {{scope.row.reply ? scope.row.reply : '--'}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="Create time" />
        <el-table-column label="Operate" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button v-if="user.role ===1 & scope.row.status ===0" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button v-if="user.role ===0" type="text" icon="el-icon-chat-dot-square" @click="handleReply(scope.row)">Reply</el-button>
            <el-button type="text" icon="el-icon-delete" class="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageNum" :page-sizes="[5, 10, 20]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 添加对话框 -->
    <!-- Add dialog box -->
    <el-dialog :visible.sync="feedbackDialog.dialogVisible" width="30%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{feedbackDialog.dialogTitle}}
      </span>
      <el-form :model="feedbackDialog.form" :rules="feedbackDialog.rules" ref="form" label-position="right" label-width="80px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="feedbackDialog.form.title" placeholder="Please enter the title"></el-input>
        </el-form-item>
        <el-form-item label="Content" prop="content">
          <el-input type="textarea" v-model.lazy="feedbackDialog.form.content" placeholder="Please enter content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="feedbackDialog.dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="save" round>Yes</el-button>
      </span>
    </el-dialog>

    <!-- 回复对话框 -->
    <!-- Reply dialog box -->
    <el-dialog :visible.sync="replyDialog.dialogVisible" width="30%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{replyDialog.dialogTitle}}
      </span>
      <el-form :model="replyDialog.form" :rules="replyDialog.rules" ref="replyForm" label-position="right" label-width="80px">
        <el-form-item label="content" prop="content">
          <el-input type="textarea" v-model.lazy="replyDialog.form.reply" placeholder="Please enter reply content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyDialog.dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="saveReply" round>Yes</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>

export default {
  name: 'Feedback',
  components: {},
  data() {
    return {
      loading: true,
      user: this.$store.state.user,
      query: {
        title: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      feedbackDialog: {
        form: {},
        dialogVisible: false,
        dialogTitle: '',
        rules: {
          title: [
            { required: true, message: 'Please enter the message title', trigger: 'blur' }
          ],
          content: [
            { required: true, message: 'Please enter the message content', trigger: 'blur' }
          ]
        }
      },
      replyDialog: {
        form: {},
        dialogVisible: false,
        dialogTitle: '',
        rules: {
          reply: [
            { required: true, message: 'Please enter the reply content', trigger: 'blur' }
          ]
        }
      }

    }
  },

  created() {
    this.load()
  },


  methods: {
    load() {
      this.loading = true
      if (this.user.role != 0) {
        this.query.userId = this.user.id
      }
      this.$http.get("/feedback", {
        params: this.query
      }).then(res => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },

    // Search按钮
    //Search button
    handleSearch() {
      this.$set(this.query, 'pageNum', 1);
      this.load();
    },

    //添加按钮事件
    //'Add new' button event
    add() {
      this.feedbackDialog.form = { "userId": this.user.id }
      this.feedbackDialog.dialogTitle = "Add new message"
      this.feedbackDialog.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['replyForm'].clearValidate();
      })
    },

    //编辑按钮事件
    //'Edit' button event
    handleEdit(row) {
      this.feedbackDialog.form = row;
      this.feedbackDialog.dialogTitle = "Edit message"
      this.feedbackDialog.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },



    //留言回复
    //Message reply
    handleReply(row) {
      this.replyDialog.form = row;
      this.replyDialog.dialogTitle = "Message reply"
      this.replyDialog.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },

    //添加保存事件
    //Add save Event
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.feedbackDialog.form.id) {  
            // 更新
            //Update
            this.$http.put("/feedback", this.feedbackDialog.form).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load() 
                this.feedbackDialog.dialogVisible = false  
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
            this.$http.post("/feedback", this.feedbackDialog.form).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load() 
                this.feedbackDialog.dialogVisible = false  
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



    //回复保存事件
    //Save reply event
    saveReply() {
      this.$refs['replyForm'].validate((valid) => {
        if (valid) {
          this.replyDialog.form.status = 1;
          this.$http.put("/feedback", this.replyDialog.form).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: res.msg
              })
              this.load() 
              this.replyDialog.dialogVisible = false  
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


    //删除按钮事件
    //'Delete' button 
    handleDelete(row) {
      // 二次确认
      //Secondary confirmation
      this.$confirm('Are you sure you want to delete it?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/feedback/" + row.id).then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: res.msg
            })
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
          this.load()
        })
      })

    },


    //切换每页数据条数
    //Switch the number of data entries per page
    handleSizeChange(pageSize) {
      this.$set(this.query, 'pageSize', pageSize);
      this.load()
    },
    //切换页码
    //Switch page numbers
    handleCurrentChange(pageNum) {  
      // 改变当前页码触发
      //Trigger by changing the current page number
      this.$set(this.query, 'pageNum', pageNum);
      this.load()
    },


  }
}
</script>
