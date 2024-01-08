var express = require('express');
var moment = require('moment')
var router = express.Router();
var Borrow = require("../models/borrow");
var Configs = require("../models/configs");
var Book = require("../models/book");
var User = require("../models/user");


/**
 *  @description 图书借阅,Book borrow
 *  @return {*}
 */

 router.post('/borrow', async (req, res) => {
  try {
    var today = moment(new Date()).format('YYYY-MM-DD');
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { userId,bookId,duration,remark} = req.body;
    //查询已经借阅的数量
    //Query the borrowed quantity
    var borrowNum = await Borrow.countDocuments({'user':userId}).exec();
    //查询系统运行借阅的数量
    //Query the number of borrowed items in the system's operation
    var config = await Configs.findOne({'code':'maxNum'}).exec();
    if(borrowNum > config.value){
      res.json({ code: 500, msg: 'You have exceeded the maximum borrowing quantity allowed by the system!' });
      return;
    }
    //更新图书状态
    //Update book status
    await Book.updateOne({ _id:bookId }, {'status':1}).exec();
    //保存借阅记录
    //Save borrowing records
    var result = await Borrow.create({'user':userId,'book':bookId,'beginTime':today,'endTime':'','duration':duration,'remark':remark ? remark : '','status':0,'createTime':date,'updateTime':date})
    if(result != null){
      res.json({ code: 200, msg: 'Borrowed successed!'});
    }else{
      res.json({ code: 500, msg: 'Save failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 借阅状态更新,Borrow status update
 *  @return {*}
 */
 router.put('/borrow/back', async (req, res) => {
  try {
    const { id} = req.body;
    //查询图书借阅信息
    //Query book borrow information
    var borrow = await Borrow.findById({_id:id}).exec();
    console.log('borrow===>',borrow)
    var date = new Date(borrow.beginTime);
    date.setMonth(date.getMonth() + (borrow.duration == 0 ? 1 : 3));
    var now = new Date();
    var flag = moment(now).isBefore(date);
    //缴纳逾期费用
    //Payment of overdue fees
    if(!flag){
      
      var  days = moment(now).diff(moment(date),'day');
      var config = await Configs.findOne({'code':'deduct'}).exec();
      var deductAmount = parseFloat(config.value) * days;
      var user = await User.findById({_id:borrow.user}).exec();
      if(user.amount < deductAmount){
        res.json({ code: 500, msg: 'Operation failed, insufficient balance, please recharge!' });
        return;
      }
      //缴费
      //Pay
      var restAmount = user.amount - deductAmount;
      await User.updateOne({ _id:user.id }, {'amount':restAmount}).exec();
    }
    ////Update book status
    await Book.updateOne({ _id:borrow.book }, {'status':0}).exec();
    //更新借阅状态
    //Update borrow status
    var today = moment(now).format('YYYY-MM-DD');
    var result = await Borrow.updateOne({ _id:id }, {'status':1,'endTime':today}).exec();
    if(result != null){
      var msg;
      if(!flag){
        msg = 'Return successed, you are overdue'+days+"days,"+deductAmount+"pounds deducted!";
      }else{
        msg = "Return successed!";
      }
      res.json({ code: 200, msg: msg});
    }else{
      res.json({ code: 500, msg: 'Operate failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 删除借阅记录,Delete borrow records
 *  @return {*}
 */
 router.delete('/borrow/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let result = await Borrow.deleteOne({ _id:id }).exec();
    if(result != null){
      res.json({ code: 200, msg: 'Delete successed!'});
    }else{
      res.json({ code: 500, msg: 'Delete failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});



/**
 *  @description 图书借阅分页,Book borrow pagination
 *  @return {*}
 */
 router.get('/borrow', async (req, res) => {
  try {
    var userId = req.query.userId;
    var bookId = req.query.bookId;
    var status = req.query.status;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(userId){
      params.user = userId;
    }
    if(bookId){
      params.book = bookId;
    }
    if(status){
      params.status = parseInt(req.query.status);
    }
    
    var records = await Borrow.find(params).populate('user','nickname').populate('book','bookName isbn').skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await Borrow.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;