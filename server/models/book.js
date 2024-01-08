// var mongoose = require('mongoose')
const { mongoose } = require('../config/mongodb.js');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    "_id"           :{type:Number},
    "category"      :{type:Number,ref:'Category'},
    "isbn"          :{type:String},
    "bookName"      :{type:String},
    "author"        :{type:String},
    "price"         :{type:Number},
    "press"         :{type:String},
    "cover"         :{type:String},
    "status"        :{type:Number},
    "remark"        :{type:String},
    "createTime"    :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"    :{type:Date},
}, {
  versionKey: false,
  toJSON:{ getters: true }
})


//下面用自增插件，实现id的自增功能
bookSchema.plugin(autoIncrement.plugin, {
  model: 't_book',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Book',bookSchema,'t_book')