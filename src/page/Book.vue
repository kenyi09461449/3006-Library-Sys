<template>
  <div style="word-wrap:break-word">
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item>
          <el-select v-model="query.categoryId" placeholder="Please select a book classification" clearable>
            <el-option v-for="item in categoryList" :label="item.categoryName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.bookName" placeholder="Please enter the book name" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.isbn" placeholder="Please enter the ISBN of the book" @keydown.enter.native="handleSearch" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.status" placeholder="Please select borrowing status" clearable>
            <el-option label="Unlent" :value="0"></el-option>
            <el-option label="Lended" :value="1"></el-option>
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
      <el-table v-loading="loading" :data="tableData" border class="table" ref="multipleTable">
        <el-table-column v-if="false" prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="category.categoryName" label="Category"></el-table-column>
        <el-table-column prop="bookName" label="Book name"></el-table-column>
        <el-table-column prop="isbn" label="ISBN"></el-table-column>
        <el-table-column prop="author" label="Author"></el-table-column>
        <el-table-column prop="price" label="Price"></el-table-column>
        <el-table-column prop="press" label="Press"></el-table-column>
        <el-table-column label="Cover" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.cover" class="table-td-thumb" :src="scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status === 0">Unlent</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 1">Lended</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="remark" width="300"></el-table-column>
        <el-table-column prop="createTime" label="createTime" width="150"></el-table-column>
        <el-table-column label="Operate" :width="user.role == 0 ? '150':'80'" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="user.role ===0" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">Edit</el-button>
            <el-button v-if="user.role ===1" type="text" icon="el-icon-star-off" @click="handleBorrow(scope.row)">Borrow</el-button>
            <el-button v-if="user.role ===0" type="text" icon="el-icon-delete" class="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageNum" :page-sizes="[5, 10, 20]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 添加弹窗 -->
    <!-- Add pop ups -->
    <el-dialog :visible.sync="bookDialog.dialogVisible" width="50%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{bookDialog.dialogTitle}}
      </span>
      <el-form :model="bookDialog.form" :rules="bookDialog.rules" ref="form" label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Category" prop="categoryId">
              <el-select v-model="bookDialog.form.categoryId" placeholder="Please select book category">
                <el-option v-for="item in categoryList" :label="item.categoryName" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="bookDialog.form.isbn" placeholder="Please input ISBN of the book"></el-input>
            </el-form-item>
            <el-form-item label="Book name" prop="bookName">
              <el-input v-model="bookDialog.form.bookName" placeholder="Please input book name"></el-input>
            </el-form-item>
            <el-form-item label="Author" prop="author">
              <el-input v-model="bookDialog.form.author" placeholder="Please enter the book author"></el-input>
            </el-form-item>
            <el-form-item label="Price" prop="price">
              <el-input v-model="bookDialog.form.price" placeholder="Please enter the book price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cover" prop="cover">
              <el-upload class="avatar-uploader" action="http://localhost:8080/upload/2" :show-file-list="false" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
                <img v-if="bookDialog.form.cover" :src="bookDialog.form.cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="Press" prop="press">
              <el-input v-model="bookDialog.form.press" placeholder="Please enter the book publisher"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Remark" prop="remark">
              <el-input type="textarea" v-model.lazy="bookDialog.form.remark" placeholder="Please enter the book remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bookDialog.dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="handleSave" round>Yes</el-button>
      </span>
    </el-dialog>

    <!-- 借阅弹窗 -->
    <!-- Borrowing pop-up window -->
    <el-dialog :visible.sync="borrowDialog.dialogVisible" width="45%">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-edit-outline"></i>
        {{borrowDialog.dialogTitle}}
      </span>
      <el-form :model="borrowDialog.form" :rules="borrowDialog.rules" ref="form" label-position="right" label-width="160px">
        <el-form-item label="Borrow  duration" prop="duration">
          <el-select v-model="borrowDialog.form.duration" placeholder="Please select borrowing duration">
            <el-option label="1 mouth" :value="0"></el-option>
            <el-option label="3 mouths" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input type="textarea" v-model.lazy="borrowDialog.form.remark" placeholder="Please enter remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="borrowDialog.dialogVisible = false" round>Cancel</el-button>
        <el-button type="primary" @click="handleBorrowSave" round>Yes</el-button>
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
        categoryId: '',
        bookName: '',
        isbn: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      categoryList: [],
      bookDialog: {
        form: {},
        dialogVisible: false,
        dialogTitle: '',
        rules: {
          categoryId: [
            { required: true, message: 'Please select a book classification', trigger: 'blur' }
          ],
          isbn: [
            { required: true, message: 'Please enter the ISBN number of the book', trigger: 'blur' }
          ],
          bookName: [
            { required: true, message: 'Please enter the book name', trigger: 'blur' }
          ],
          author: [
            { required: true, message: 'Please enter the book author', trigger: 'blur' }
          ],
          price: [
            { required: true, message: 'Please enter the book price', trigger: 'blur' }
          ],
          press: [
            { required: true, message: 'Please enter the book publisher', trigger: 'blur' }
          ],
          cover: [
            { required: true, message: 'Please upload the book cover', trigger: 'blur' }
          ]
        },
      },
      borrowDialog: {
        dialogVisible: false,
        dialogTitle: '',
        form: {},
        rules: {
          duration: [
            { required: true, message: 'Please select borrow duration', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: 'Please enter remark', trigger: 'blur' }
          ]
        },
      }
    };
  },
  created() {
    this.load();
    this.loadAllCategory()
  },
  methods: {
    // 获取table数据
    //Get table data
    load() {
      this.loading = true
      this.$http.get("/book", {
        params: this.query
      }).then(res => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },

    //获取图书分类
    //Get book category
    loadAllCategory() {
      this.$http.get("/category/all").then(res => { this.categoryList = res.data })
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
      this.bookDialog.form = {}
      this.bookDialog.dialogTitle = "Add new book"
      this.bookDialog.dialogVisible = true;
      this.$nextTick(() => {
        //清除提示
        //Clear validate
        this.$refs.form.clearValidate();
      })
    },

    // 编辑操作
    handleEdit(row) {
      this.bookDialog.dialogTitle = "Edit book"
      this.bookDialog.form = row;
      this.bookDialog.form.categoryId = row.category.id;
      this.bookDialog.dialogVisible = true;
      this.$nextTick(() => {
        //清除提示
        //Clear validate
        this.$refs.form.clearValidate();
      })
    },


    //点击借阅事件
    //Click on borrowed event
    handleBorrow(row) {
      if (row.status == 1) {
        this.$message({
          type: "error",
          message: "The book has been borrowed!"
        })
        return;
      }
      this.borrowDialog.dialogTitle = 'Borrow'
      this.borrowDialog.form = { userId: this.user.id, bookId: row.id }
      this.borrowDialog.dialogVisible = true
      this.$nextTick(() => {
        //清除提示
        //Clear validate
        this.$refs['form'].clearValidate();
      })
    },

    // 保存
    //Save
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.bookDialog.form.id) {  
            // 更新
            //Update
            this.$http.put("/book", this.bookDialog.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load()
                this.bookDialog.dialogVisible = false
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
            this.$http.post("/book", this.bookDialog.form).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: res.msg
                })
                this.load()
                this.bookDialog.dialogVisible = false
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


    //借阅保存事件
    //Borrowing saving Event
    handleBorrowSave() {
      // 表单验证
      //Form validation
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http.post("/borrow", this.borrowDialog.form).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: res.msg
              })
              this.load()
              this.borrowDialog.dialogVisible = false
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
    //Delete operation
    handleDelete(row) {
      // 二次确认删除
      //Secondary confirmation deletion
      this.$confirm('Are you sure you want to delete it?', 'prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/book/" + row.id).then(res => {
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


    //图书封面上传成功回调
    //Bookcover successfully uploaded callback
    handleUploadSuccess(res) {
      this.$set(this.bookDialog.form, "cover", res.data)
      this.$message.success("上传成功")
    },


    //图书封面上传前校验
    //Verification before uploading book covers
    beforeUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('Only JPG file!');
      }
      if (!isLt2M) {
        this.$message.error('The image size cannot exceed 2MB');
      }
      return isJPG && isLt2M;
    },
  }
};
</script>
<style scoped>
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
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
</style>