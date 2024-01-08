<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="query.title" placeholder="Announcement" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" round>Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <div class="handle-box" v-if="role === 0">
        <el-button type="primary" @click="handleAdd" icon="el-icon-circle-plus-outline" round>Add new</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable">
        <el-table-column v-if="false" prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="Title"></el-table-column>
        <el-table-column prop="createTime" label="Release time"></el-table-column>
        <el-table-column label="Operate" :width="user.role ==0 ? '120' : '80'" fixed="right">
          <template slot-scope="scope">
            <template v-if="role === 0">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">Edit</el-button>
              <el-button type="text" icon="el-icon-delete" class="danger" @click="handleDelete(scope.row)">Delete</el-button>
            </template>
            <el-button v-else type="text" icon="el-icon-view" @click="handleDetail(scope.row)">Details</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageNum" :page-sizes="[5, 10, 20]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <!-- Edit window pop-up -->
    <el-dialog :visible.sync="dialogVisible" width="60%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{dialogTitle}}
      </span>
      <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="70px" :disabled="isDetail" v-if="user.role == 0">
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title" placeholder="Please enter announcement title" ref="title"></el-input>
        </el-form-item>
        <el-form-item label="Content" prop="content">
          <div id="div1"></div>
        </el-form-item>
      </el-form>
      <el-card v-else>
        <div class="newstext-box">
          <h1 class="news-title-h1">{{notice.title}}</h1>
          <div class="picview-other">
            <span><i class="fa fa-clock-o"> {{notice.createTime}}</i></span>
          </div>
          <div class="newstext" v-html="notice.content"></div>
          <div class="clear"></div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>取消</el-button>
        <el-button type="primary" @click="save" v-if="role === 0" round>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Notice',
  data() {
    return {
      loading: true,
      user: this.$store.state.user,
      role: this.$store.state.user.role,
      query: {
        title: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {},
      notice: {},
      editor: null,
      isDetail: false,
      rules: {
        deptName: [
          { required: true, message: 'Please enter the department name', trigger: 'blur' }
        ]
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
      this.$http.get("/notice", {
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
      this.dialogTitle = "Release announcement"
      this.form = {}
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        if (!this.editor) {
          this.editor = new E('#div1')
          this.editor.config.excludeMenus = ['image', 'video']
          this.editor.create()
        }
        this.editor.txt.html("")
      })
    },
    // 编辑操作
    //Edit
    handleEdit(row) {
      this.dialogTitle = "Edit announcement"
      this.form = row;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        if (!this.editor) {
          this.editor = new E('#div1')
          this.editor.config.excludeMenus = ['image', 'video']

          this.editor.create()
        }
        this.editor.txt.html(row.content)
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          //获取公告内容
          //Get announcement content
          const content = this.editor.txt.html()
          if (content == null || content === '') {
            return this.$message({
              type: "error",
              message: "Please enter the announcement content"
            })
          }
          this.form.content = content
          if (this.form.id) {  
            // 更新
            //Update
            this.$http.put("/notice", this.form).then(res => {
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
          } else {  
            // 新增
            //Add new
            this.$http.post("/notice", this.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load() 
                this.dialogVisible = false  
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

    //详情
    //Details
    handleDetail(row) {
      this.dialogTitle = 'Announcement details'
      this.notice = row;
      this.dialogVisible = true;
    },


    // 删除操作
    //Delete
    handleDelete(row) {
      // 二次确认删除
      //Secondary confirmation
      this.$confirm('Are you sure you want to delete it?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/notice/" + row.id).then(res => {
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
    handleSizeChange(pageSize) {   
      this.$set(this.query, 'pageSize', pageSize);
      this.load()
    },
    
    handleCurrentChange(val) {
      this.$set(this.query, 'pageNum', val);
      this.load();
    }
  }
};
</script>
<style lang="scss" scoped>
.news-title-h1 {
  font-size: 22px;
}

.picview-other {
  overflow: hidden;
  color: #888;
  margin-bottom: 15px;
}

.picview-other span {
  float: left;
  margin-right: 15px;
}

.newstext {
  line-height: 24px;
  margin-bottom: 20px;
  overflow: hidden;
}

.newstext p {
  margin-bottom: 20px;
}

.newstext h2,
.newstext h3,
.newstext h4,
.newstext h5,
.newstext h6 {
  font-size: 16px;
  margin: 20px 0;
  position: relative;
  padding-left: 10px;
}
</style>
