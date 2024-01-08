var express = require('express');
var moment = require('moment')
var router = express.Router();
var Category = require("../models/category");


/**
 *  @description 图书分类保存,Book classification and preservation
 *  @return {*}
 */

 router.post('/category', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { categoryName, remark} = req.body;
    var result = await Category.create({'categoryName':categoryName,'remark':remark,'createTime':date,'updateTime':date})
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
 *  @description 图书分类更新,Book classification update
 *  @return {*}
 */
 router.put('/category', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { categoryName, remark,id} = req.body;
    var result = await Category.updateOne({ _id:id }, {'categoryName':categoryName,'remark':remark,'updateTime':date}).exec();
    if(result != null){
      res.json({ code: 200, msg: 'Update successed!'});
    }else{
      res.json({ code: 500, msg: 'Update failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 图书分类删除，Book classification delete
 *  @return {*}
 */
 router.delete('/category/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let result = await Category.deleteOne({ _id:id }).exec();
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
 *  @description 图书分类分页，Book classification pagination
 *  @return {*}
 */
 router.get('/category', async (req, res) => {
  try {
    var categoryName = req.query.categoryName;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(categoryName){
      params.categoryName = categoryName;
    }
    var records = await Category.find(params).skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await Category.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});



/**
 *  @description 所有图书分类，All book categories
 *  @return {*}
 */
 router.get('/category/all', async (req, res) => {
  try {
    let data = await Category.find().sort({'createTime':1}).exec();
    res.json({ code: 200, msg: 'Query successed!',data:data});
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;