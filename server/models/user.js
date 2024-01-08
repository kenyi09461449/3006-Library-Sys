// var mongoose = require('mongoose')
const { mongoose } = require('../config/mongodb.js');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "_id"         :{type:Number},
    "username"    :{type:String},
    "password"    :{type:String},
    "nickname"    :{type:String},
    "sex"         :{type:Number},
    "birthday"    :{type:String},
    "telephone"   :{type:String},
    "email"       :{type:String},
    "profession"  :{type:String},
    "avatar"      :{type:String},
    "address"     :{type:String},
    "amount"      :{type:Number},
    "status"      :{type:Number},
    "createTime"  :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"  :{type:Date},
}, {
  versionKey: false,
  toJSON:{ getters: true }
})


//ID的自增功能
//ID auto increment function
userSchema.plugin(autoIncrement.plugin, {
  model: 't_user',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('User',userSchema,'t_user')