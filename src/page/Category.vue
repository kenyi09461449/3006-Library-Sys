<template>
  <div>
    <!-- Search框 -->
    <!-- Search box -->
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="query.categoryName" placeholder="Please select a book classification" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="el-icon-search" round>Search</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据展示 -->
    <!-- Data disaplay -->
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="add" icon="el-icon-circle-plus-outline" round>Add new</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column v-if="false" prop="id" label="ID" sortable />
        <el-table-column prop="categoryName" label="Book category" />
        <el-table-column prop="remark" label="Remark" />
        <el-table-column prop="createTime" label="Create time" />
        <el-table-column label="Operate" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button type="text" icon="el-icon-delete" class="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <!-- Paging component -->
      <div class="page-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.pageNum" :page-sizes="[10, 20, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 种类添加 -->
    <!-- Add category -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{dialogTitle}}
      </span>
      <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="80px">
        <el-form-item label="Book category name" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="Please enter the book category name"></el-input>
        </el-form-item>
        <el-form-item label="Category remark" prop="remark">
          <el-input type="textarea" v-model.lazy="form.remark" placeholder="Please enter the category remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="save" round>Yes</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Station',
  components: {},
  data() {
    return {
      loading: true,
      query: {
        categoryName: '',
        pageNum: 1,
        pageSize: 10
      },
      form: {},
      dialogVisible: false,
      dialogTitle: '',
      total: 0,
      tableData: [],
      rules: {
        categoryName: [
          { required: true, message: 'Please enter the book category name', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.load()
  },


  methods: {
    load() {
      this.loading = true
      this.$http.get("/category", {
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
      this.form = {}
      this.dialogTitle = "Add new category"
      this.dialogVisible = true
      this.$nextTick(() => {
        
        this.$refs.form.clearValidate();
      })
    },

    //编辑按钮事件
    //'Edit' button event 
    handleEdit(row) {
      this.form = row;
      this.dialogTitle = "Edit category"
      this.dialogVisible = true;
      this.$nextTick(() => {
        
        this.$refs.form.clearValidate();
      })
    },

    //添加保存事件
    //Save event
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {  // Update
            this.$http.put("/category", this.form).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                // 刷新表格的数据
                //Refresh Table Data
                this.load() 
                // 关闭弹窗
                //Close pop-up window
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
            this.$http.post("/category", this.form).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                // 刷新表格的数据
                //Refresh Table Data

                this.load() 
                // 关闭弹窗
                //Close pop-up window
                this.dialogVisible = false  
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

    //删除按钮事件
    //'Delete' button event
    handleDelete(row) {
      // 二次确认删除
      //Secondary confirmation
      this.$confirm('Are you sure you want to delete it?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/category/" + row.id).then(res => {
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
