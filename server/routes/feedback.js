var express = require('express');
var moment = require('moment')
var router = express.Router();
var Feedback = require("../models/feedback");

/**
 *  @description 反馈保存，Save feedback
 *  @return {*}
 */

 router.post('/feedback', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { userId, title,content} = req.body;
    var result = await Feedback.create({'user':userId,'title':title,'content':content,'status':0,'reply':'','createTime':date,'updateTime':date})
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
 *  @description 反馈更新 / 回复,Feedback updates/replies
 *  @return {*}
 */
 router.put('/feedback', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { id,title,content,status,reply} = req.body;
    var result = await Feedback.updateOne({ _id:id }, {'title':title,'content':content,'status':status,'reply':reply ? reply:'','updateTime':date}).exec();
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
 *  @description 反馈删除,Delete feedback
 *  @return {*}
 */
 router.delete('/feedback/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let result = await Feedback.deleteOne({ _id:id }).exec();
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
 *  @description 反馈分页,Feedback pagination
 *  @return {*}
 */
 router.get('/feedback', async (req, res) => {
  try {
    var userId = req.query.userId;
    var title = req.query.title;
    var nickname = req.query.nickname;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(userId){
      params.user = userId;
    }
    if(title){
      params.title = title;
    }
    if(nickname){
      params.nickname = nickname;
    }
    var records = await Feedback.find(params).populate('user','nickname').skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await Feedback.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;