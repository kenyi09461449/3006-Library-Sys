<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="query.code" placeholder="Please enter the config code" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.name" placeholder="Please enter the config name" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" round>Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <div class="handle-box">
      </div>
      <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable">
        <el-table-column v-if="false" prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="code" label="Code"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="value" label="Value"></el-table-column>
        <el-table-column prop="createTime" label="Create time" width="150"></el-table-column>
        <el-table-column label="Operate" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageNum" :page-sizes="[5, 10, 20]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 添加弹窗 -->
    <!-- Add popup -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{dialogTitle}}
      </span>
      <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="80px">
        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" placeholder="Please enter the config code"></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Please enter the config name"></el-input>
        </el-form-item>
        <el-form-item label="Config value" prop="value">
          <el-input v-model="form.value" placeholder="Please enter config value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="handleSave" round>Yes</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Dept',
  data() {
    return {
      user: this.$store.state.user,
      loading: true,
      query: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      categoryList: [],
      form: {},
      dialogVisible: false,
      dialogTitle: '',
      rules: {
        code: [
          { required: true, message: 'Please enter the config code', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'Please enter the config name', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'Please enter the config value', trigger: 'blur' }
        ]
      },
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
      this.$http.get("/configs", {
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
    //Add new config
    handleAdd() {
      this.form = {}
      this.dialogTitle = "Add new config"
      this.dialogVisible = true;
      this.$nextTick(() => {
        
        this.$refs.form.clearValidate();
      })
    },

    // 编辑操作
    //Edit config
    handleEdit(row) {
      this.dialogTitle = "Edit config"
      this.form = row;
      this.dialogVisible = true;
      this.$nextTick(() => {
        
        this.$refs.form.clearValidate();
      })
    },


    // 保存
    //Save
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {  
            // 更新
            //Update
            this.$http.put("/configs", this.form).then(res => {
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
            this.$http.post("/configs", this.form).then(res => {
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
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },



    // 删除操作
    //Delete
    handleDelete(row) {
      // 二次确认删除
      //Secondary confirmation
      this.$confirm('Deleting system configuration will affect system operation. Are you sure you want to delete it?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/configs/" + row.id).then(res => {
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
    },



  }
};
</script>