var express = require('express');
var moment = require('moment')
var router = express.Router();
var Admin = require("../models/admin");
var User = require("../models/user");

/**
 *  @description 用户名密码登录,Login Username Password
 *  @param  {string} username  Username
 *  @param  {string} password  Password
 *  @return {*}
 */

 router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    var row = null;
    if(role == 0){
      row = await Admin.findOne({username,password}).exec();
    }else{
      row = await User.findOne({username,password}).exec();
    }
    if(row != null){
      let user = {'id':row.id,'username':row.username,'password':row.password,'nickname':row.nickname,role:role,'avatar':row.avatar}
      res.json({ code: 200, msg: 'Login succeeded',data: user });
    }else{
      res.json({ code: 500, msg: 'Login failed, username and password incorrect!' });
    }
  } catch (e) {
    console.log(e);
    res.json({ code: 500, msg: e.message });
  }
});


/**
 *  @description 用户信息保存,User information saving
 *  @return {*}
 */
 router.post('/user', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { username,password,nickname, telephone,email,sex,birthday,profession,avatar,address} = req.body;
    var exist = await User.findOne({username}).exec();
    if(exist != null){
      res.json({ code: 500, msg: 'The username already exists, please re-enter!'});
      return;
    }
    var result = await User.create({'username':username,'password':password,'nickname':nickname,'telephone':telephone,'email':email,'sex':sex,'birthday':birthday,'profession':profession,'avatar':avatar,'address':address,'amount':0,'status':0,'createTime':date,'updateTime':date})
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
 *  @description  用户信息更新,User information update
 *  @return {*}
 */
 router.put('/user', async (req, res) => {
  try {
    var date = moment(new Date()).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    const { id,username,password,nickname, telephone,email,sex,birthday,profession,avatar,address} = req.body;
    var user = await User.findById(id).exec();
    if(user.username != username){
      var exist = await User.findOne({username}).exec();
      if(exist != null){
        res.json({ code: 500, msg: 'The username already exists, please re-enter!'});
        return;
      }
    }
    var result = await User.updateOne({ _id:id }, {'username':username,'password':password,'nickname':nickname,'telephone':telephone,'email':email,'sex':sex,'birthday':birthday,'profession':profession,'avatar':avatar,'address':address,'updateTime':date}).exec();
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
 *  @description 用户删除,Delete User
 *  @return {*}
 */
 router.delete('/user/:id', async (req, res) => {
  try {
    var id = req.params.id;
    let result = await User.deleteOne({ _id:id }).exec();
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
 *  @description 用户分页,User pagination
 *  @return {*}
 */
 router.get('/user', async (req, res) => {
  try {
    var username = req.query.username;
    var nickname = req.query.nickname;
    var status = req.query.status;
    var limit = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * limit;
    var params = {};
    if(username){
      params.username = username;
    }
    if(nickname){
      params.nickname = nickname;
    }
    if(status){
      params.status = status;
    }
    var records = await User.find(params).skip(start).limit(limit).sort({'createTime':-1}).exec();
    var total = await User.countDocuments(params).exec();
    var page = {'total':total,'records':records};
    res.json({ code: 200, msg: 'Query successed!',data:page});
  } catch (e) {
    console.log(e);
  }
});


/**
 *  @description 根据用户ID查询用户,Query users based on their ID
 *  @return {*}
 */
 router.get('/user/info/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var user = await User.findById(id).exec();
    if(user != null){
      res.json({ code: 200, msg: 'Query successed!','data':user});
    }else{
      res.json({ code: 500, msg: 'Query failed' });
    }
  } catch (e) {
    console.log(e);
  }
});



/**
 *  @description  用户密码更新,User password update
 *  @return {*}
 */
 router.put('/user/password', async (req, res) => {
  try {
    const { id,password} = req.body;
    var result = await User.updateOne({ _id:id }, {password}).exec();
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
 *  @description  充值,Recharge
 *  @return {*}
 */
 router.put('/user/invest', async (req, res) => {
  try {
    const { id,amount} = req.body;
    var result = await User.updateOne({ _id:id }, {amount}).exec();
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
 *  @description  状态更新,Update status
 *  @return {*}
 */
 router.put('/user/status', async (req, res) => {
  try {
    const { id,status} = req.body;
    var result = await User.updateOne({ _id:id }, {status}).exec();

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
 *  @description 所有学生信息,All students infor
 *  @return {*}
 */
 router.get('/user/all', async (req, res) => {
  try {
    let data = await User.find().sort({'createTime':1}).exec();
    res.json({ code: 200, msg: 'Query successed!',data:data});
  } catch (e) {
    console.log(e);
  }
});


module.exports = router;
