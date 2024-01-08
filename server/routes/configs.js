var express = require('express');
var moment = require('moment')
var router = express.Router();
var Configs = require("../models/configs");


/**
 *  @description 配置更新，Upadte config
 *  @return {*}
 */
 router.put('/configs', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { id, name, value} = req.body;
    var result = await Configs.updateOne({ _id:id }, {'name':name,'value':value,'updateTime':date}).exec();
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
 *  @description 系统配置,System config
 *  @return {*}
 */
 router.get('/configs', async (req, res) => {
  try {
    var code = req.query.code;
    var name = req.query.name;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(code){
      params.code = code;
    }
    if(name){
      params.code = name;
    }
    var records = await Configs.find(params).skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await Configs.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;