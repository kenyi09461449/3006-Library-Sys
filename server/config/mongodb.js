/**
 * MongoDB数据库配置
 * MongoDB database configuration
 */

 const mongoose = require('mongoose')
 const autoIncrement = require('mongoose-auto-increment')
 //删除弃用警告
 // remove DeprecationWarning
mongoose.set('useFindAndModify', false)

// mongoose Promise
mongoose.Promise = global.Promise

// connect
var connect = () => {

  mongoose.connect('mongodb://127.0.0.1:27017/db_book_vue?tz=Asia/Shanghai',{useNewUrlParser: true})
  
  // 连接成功
  //Connect successed
	mongoose.connection.once('open', () => {
		console.log('Database connect successed!')
	})


  // 连接错误
  //Connect failed
	mongoose.connection.on('error', error => {
		console.log('Database connect failed!', error)
	})


    // 连接错误
	//Connect failed
	mongoose.connection.on('close', error => {
		console.log('Database connect failed!', error)
	})

  // 自增 ID 初始化
  //Self increasing ID initialization
  autoIncrement.initialize(mongoose.connection)
}

//模块导出
//Module export
module.exports = {
  mongoose,
  connect
}



