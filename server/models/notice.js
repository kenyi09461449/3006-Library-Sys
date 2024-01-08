// var mongoose = require('mongoose')
const { mongoose } = require('../config/mongodb.js');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')
var Schema = mongoose.Schema;

var noticeSchema = new Schema({
    "_id"             :{type:Number},
    "title"           :{type:String},
    "content"         :{type:String},
    "createTime"      :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"      :{type:Date},
}, {
  versionKey: false,
  toJSON:{ getters: true }
})


//下面用自增插件，实现id的自增功能
noticeSchema.plugin(autoIncrement.plugin, {
  model: 't_notice',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Notice',noticeSchema,'t_notice')