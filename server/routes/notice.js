var express = require('express');
var moment = require('moment')
var router = express.Router();
var Notice = require("../models/notice");

/**
 *  @description 公告保存,Announcement Save
 *  @return {*}
 */

 router.post('/notice', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { title, content} = req.body;
    var result = await Notice.create({'title':title,'content':content,'createTime':date,'updateTime':date})
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
 *  @description 公告更新,Update Announcement
 *  @return {*}
 */
 router.put('/notice', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { title, content,id} = req.body;
    var result = await Notice.updateOne({ _id:id }, {'title':title,'content':content,'updateTime':date}).exec();
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
 *  @description 公告删除,Delete Announcement
 *  @return {*}
 */
 router.delete('/notice/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let result = await Notice.deleteOne({ _id:id }).exec();
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
 *  @description 公告分页,Announcement pagination
 *  @return {*}
 */
 router.get('/notice', async (req, res) => {
  try {
    var title = req.query.title;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(title){
      params.title = title;
    }
    var records = await Notice.find(params).skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await Notice.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});




/**
 *  @description 查询公告,Query announcements
 *  @return {*}
 */
 router.get('/notice/top/:num', async (req, res) => {
  try {
    var num = parseInt(req.params.num);
    let data = await Notice.find().limit(num).sort({'createTime':-1}).exec();
    if(data != null){
      res.json({ code: 200, msg: 'Query successed!',data:data});
    }else{
      res.json({ code: 500, msg: 'Operate failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});


module.exports = router;