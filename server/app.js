var createError = require('http-errors');
var http = require('http')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
app.set('port', process.env.PORT || 8080); // 设定监听端口

// 启用socket.io
var server = http.createServer(app)
var io = require('socket.io')(server, { cors: true })
const ws = require('./config/chat');
ws.chat(io)

// 链接数据库
var mongodb = require('./config/mongodb');
mongodb.connect();

// 配置跨域
app.use((req, res, next) => {
  if (req.path !== '/' && !req.path.includes('.')) {
    res.set({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
      'Access-Control-Allow-Methods': 'POST,GET',
      'Content-Type': 'application/json; charset=utf-8'
    });
  }
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');
var categoryRouter = require('./routes/category');
var noticeRouter = require('./routes/notice');
var configsRouter = require('./routes/configs');
var bookRouter = require('./routes/book');
var borrowRouter = require('./routes/borrow');
var feedbackRouter = require('./routes/feedback');
var uploadRouter = require('./routes/upload');
var countRouter = require('./routes/count');


app.use('/', indexRouter);
app.use('/', adminRouter);
app.use('/', usersRouter);
app.use('/', categoryRouter);
app.use('/', noticeRouter);
app.use('/', configsRouter);
app.use('/', bookRouter);
app.use('/', borrowRouter);
app.use('/', feedbackRouter);
app.use('/', uploadRouter);
app.use('/', countRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//启动监听
server.listen(app.get('port'), function() {
  console.log(`服务启动成功,请打开 http://localhost:${process.env.PORT || 8080}`);
});


module.exports = app;
