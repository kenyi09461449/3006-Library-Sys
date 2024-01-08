var moment = require('moment')
var express = require('express');
var router = express.Router();
var Category = require("../models/category");
var Book = require("../models/book");
var Borrow = require("../models/borrow");
var Notice = require("../models/notice");

/**
 *  @description 首页图表统计.Homepage chart statistics
 *  @return {*}
 */
 router.get('/count', async (req, res) => {
  try {
    var result = {};
    //查询所有分类
    //Query all categories
    let categoryList = await Category.find().sort({'createTime':1}).exec();
    var bookNumArray = [];
    if(categoryList != null && categoryList.length > 0){
      for(let i=0;i<categoryList.length;i++){
        var c = categoryList[i];
        var totalNum = await Book.countDocuments({'category':c}).exec();
        var bookNumVo = {'name':c.categoryName,'value':totalNum == null ? 0 : totalNum};
        bookNumArray.push(bookNumVo);
      }
    }
    //获取过去12个月的月份
    //Get months from the past 12 months
    var monthArray = getLast12Months();
    var borrowArray = [];
    for(let i=0;i<monthArray.length;i++){
      var month = monthArray[i];
      var firstDayOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
      var lastDayOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
      var totalBorrowNum = await Borrow.countDocuments({ createTime: { $gte: firstDayOfMonth+" 00:00:00", $lte: lastDayOfMonth+" 23:59:59" } }).exec();
      borrowArray.push(totalBorrowNum == null ? 0 : totalBorrowNum);
    }
    // 公告
    //Annocement
    var noticeArray = await Notice.find().limit(2).sort({'createTime':-1}).exec();
    result.bookNumArray = bookNumArray;
    result.monthArray = monthArray;
    result.borrowArray = borrowArray;
    result.noticeArray = noticeArray;
    res.json({ code: 200, msg: 'Query successed!',data:result});
  } catch (e) {
    console.log(e);
  }
});

//获取过去12个月的月份
//Get months from the past 12 months

const getLast12Months = () => {
  var dataArr = [];
  var data = new Date();
  data.setMonth(data.getMonth() - 12, 1)
  for (var i = 0; i < 12; i++) {
      data.setMonth(data.getMonth() + 1);
      var m = data.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      dataArr.push(data.getFullYear() + "-" + (m))
  }
  return dataArr;
}

/**
* 获取指定date所在月的第一天
* 指定时间date形式不限：2022-05-20、2022/05/20...
* Get the first day of the month in which the specified date is located
* The specified date format is not limited to: 2022-05-20、2022/05/20...
*/
const getMonthFirst = (date) => {
	const stringDate = new Date(date);
  const enddate = new Date(stringDate.getFullYear(), stringDate.getMonth(), 1);
  return enddate
}

/**
* 获取指定date所在月的最后一天
* 指定时间date形式不限：2022-05-20、2022/05/20...
* Get the last day of the month in which the specified date is located
* The specified date format is not limited to: 2022-05-20、2022/05/20...
*/
const getMonthLast = (date) => {
	const stringDate = new Date(date);
  const enddate = new Date(stringDate.getFullYear(), stringDate.getMonth() + 1, 0)
  return enddate
}


module.exports = router;