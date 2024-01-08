// var mongoose = require('mongoose')
const { mongoose } = require('../config/mongodb.js');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    "_id"           :{type:Number},
    "user"          :{type:Number,ref:'User'},
    "title"         :{type:String},
    "content"       :{type:String},
    "status"        :{type:Number},
    "reply"         :{type:String},
    "createTime"    :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"    :{type:Date},
}, {
  versionKey: false,
  toJSON:{ getters: true }
})


//下面用自增插件，实现id的自增功能
feedbackSchema.plugin(autoIncrement.plugin, {
  model: 't_feedback',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Feedback',feedbackSchema,'t_feedback')