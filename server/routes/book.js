var express = require('express');
var moment = require('moment')
var router = express.Router();
var Book = require("../models/book");

/**
 *  @description 图书保存,Save book
 *  @return {*}
 */

 router.post('/book', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { categoryId,isbn,bookName,author,price,press,cover,remark} = req.body;
    var exist = await Book.findOne({isbn}).exec();
    if(exist != null){
      res.json({ code: 500, msg: 'ISBN number already exists, please re-enter!'});
      return;
    }
    var result = await Book.create({'category':categoryId,'isbn':isbn,'bookName':bookName,'author':author,'price':price,'press':press,'cover':cover,'status':0,'remark':remark,'createTime':date,'updateTime':date})
    if(result != null){
      res.json({ code: 200, msg: 'Save successed!'});
    }else{
      res.json({ code: 500, msg: 'Save failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 图书更新,Book updates
 *  @return {*}
 */
 router.put('/book', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { id,categoryId,isbn,bookName,author,price,press,cover,remark} = req.body;
    var book = await Book.findById(id).exec();
    if(book.isbn != isbn){
      var exist = await Book.findOne({isbn}).exec();
      if(exist != null){
        res.json({ code: 500, msg: 'ISBN number already exists, please re-enter!'});
        return;
      }
    }
    var result = await Book.updateOne({ _id:id }, {'category':categoryId,'isbn':isbn,'bookName':bookName,'author':author,'price':price,'press':press,'cover':cover,'remark':remark,'updateTime':date}).exec();
    if(result != null){
      res.json({ code: 200, msg: 'Save successed!'});
    }else{
      res.json({ code: 500, msg: 'Save failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 图书删除,Delete book
 *  @return {*}
 */
 router.delete('/book/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let result = await Book.deleteOne({ _id:id }).exec();
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
 *  @description 图书分页,Book pagination
 *  @return {*}
 */
 router.get('/book', async (req, res) => {
  try {
    var categoryId = req.query.categoryId;
    var bookName = req.query.bookName;
    var isbn = req.query.isbn;
    var status = req.query.status;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(categoryId){
      params.category = categoryId;
    }
    if(bookName){
      params.bookName = bookName;
    }
    if(isbn){
      params.isbn = isbn;
    }
    if(status){
      params.status = status;
    }
    var records = await Book.find(params).populate('category','categoryName').skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await Book.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 所有图书,All book
 *  @return {*}
 */
 router.get('/book/all', async (req, res) => {
  try {
    let data = await Book.find().sort({'createTime':1}).exec();
    res.json({ code: 200, msg: 'Query successed!',data:data});
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;