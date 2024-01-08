var express = require('express');
var router = express.Router();
var Admin = require("../models/admin");


/**
 *  @description  管理员信息更新,Administrator information update
 *  @return {*}
 */
 router.put('/admin', async (req, res) => {
  try {
    const { id,nickname} = req.body;
    var result = await Admin.updateOne({ _id:id }, {nickname}).exec();
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
 *  @description  管理员密码更新,Administrator password update
 *  @return {*}
 */
 router.put('/admin/password', async (req, res) => {
  try {
    const { id,password} = req.body;
    var result = await Admin.updateOne({ _id:id }, {password}).exec();
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
 *  @description 根据用户ID查询管理员,Query administrator based on user ID
 *  @return {*}
 */
 router.get('/admin/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var admin = await Admin.findById({_id:id}).exec();
    console.log('admin===>',admin);
    if(admin != null){
      res.json({ code: 200, msg: 'Query successed!','data':admin});
    }else{
      res.json({ code: 500, msg: 'Query failed!' });
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;