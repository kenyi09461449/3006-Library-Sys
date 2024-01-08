<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="query" @submit.native.prevent>
        <el-form-item v-if="user.role == 0">
          <el-select v-model="query.userId" placeholder="Please select students" filterable clearable>
            <el-option v-for="item in userList" :label="item.username+' / '+item.nickname" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.bookId" placeholder="Please select a book" filterable clearable>
            <el-option v-for="item in bookList" :label="item.isbn+ ' / ' +item.bookName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.status" placeholder="Please select borrow status" clearable>
            <el-option label="Lended" :value="0"></el-option>
            <el-option label="Unlent" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch" round>Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="container">
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column v-if="false" prop="id" label="ID" sortable />
        <el-table-column prop="user.nickname" label="Student name" />
        <el-table-column prop="book.isbn" label="ISBN" />
        <el-table-column prop="book.bookName" label="Book name" />
        <el-table-column prop="beginTime" label="Lend time" width="150" />
        <el-table-column prop="duration" label="Borrow duration">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.duration === 0">1 Mouth</el-tag>
            <el-tag type="success" v-else-if="scope.row.duration === 3">3 Mouth</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="Return time" width="150">
          <template slot-scope="scope">
            {{scope.row.endTime ? scope.row.endTime : '--'}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status === 0">Borrowing</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 1">Returned</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="Remark">
          <template slot-scope="scope">
            {{scope.row.remark ? scope.row.remark : '--'}}
          </template>
        </el-table-column>
        <el-table-column label="Operate" :width="user.role == 1 ? '80':'120'" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="fa fa-recycle" @click="handleBack(scope.row)">Return</el-button>
            <el-button v-if="user.role === 0 & scope.row.status == 1" type="text" icon="el-icon-delete" class="danger" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pageNum" :page-sizes="[5, 10, 20]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Borrow',
  data() {
    return {
      user: this.$store.state.user,
      loading: true,
      categoryList: [],
      query: {
        nickname: '',
        isbn: '',
        bookName: '',
        status: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      userList: [],
      bookList: [],
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
        cover: [
          { required: true, message: 'Please upload the book cover', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.load();
    this.loadAllUser()
    this.loadAllBook()
  },
  methods: {
    //加载表格数据
    //Load Table Data
    load() {
      this.loading = true
      if (this.user.role === 1) {
        this.query.userId = this.user.id
      }
      this.$http.get("/borrow", {
        params: this.query
      }).then(res => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },

    //获取用户信息
    //Get user information
    loadAllUser() {
      this.$http.get("/user/all").then(res => { this.userList = res.data })
    },

    //获取图书信息
    //Get book information
    loadAllBook() {
      this.$http.get("/book/all").then(res => { this.bookList = res.data })
    },


    //点击Search事件
    //Click to search
    handleSearch() {
      this.query.pageNum = 1
      this.load();
    },

    //点击归还
    //Click to return book
    handleBack(row) {
      if (row.status != 0) {
        return this.$message({
          type: "error",
          message: "The book has been returned!"
        })
      }
      // 二次确认归还
      //Secondary confirmation of return
      this.$confirm('Are you sure you want to return this book?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.put("/borrow/back", { 'id': row.id }).then(res => {
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

    // 删除操作
    //Delete
    handleDelete(row) {
      // 二次确认删除
      //Secondary confirmation
      this.$confirm('Are you sure you want to delete it?', 'Prompt', {
        type: 'warning'
      }).then(() => {
        this.$http.delete("/borrow/" + row.id).then(res => {
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

    //切换每页数据条数
    //Switch the number of data entries per page
    handleSizeChange(pageSize) {
      this.query.pageSize = pageSize
      this.load()
    },
    //切换页码
    //Switch page numbers
    handleCurrentChange(pageNum) { 
      this.query.pageNum = pageNum
      this.load()
    }
  }
};
</script>
