// var mongoose = require('mongoose')
const { mongoose } = require('../config/mongodb.js');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')
var Schema = mongoose.Schema;

var borrowSchema = new Schema({
    "_id"           :{type:Number},
    "user"          :{type:Number,ref:'User'},
    "book"          :{type:Number,ref:'Book'},
    "beginTime"     :{type:String},
    "endTime"       :{type:String},
    "duration"      :{type:Number},
    "remark"        :{type:String},
    "status"        :{type:Number},
    "createTime"    :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"    :{type:Date},
}, {
  versionKey: false,
  toJSON:{ getters: true }
})


//下面用自增插件，实现id的自增功能
borrowSchema.plugin(autoIncrement.plugin, {
  model: 't_borrow',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Borrow',borrowSchema,'t_borrow')