// var mongoose = require('mongoose')
const { mongoose } = require('../config/mongodb.js');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')
var Schema = mongoose.Schema;

var configsSchema = new Schema({
    "_id"             :{type:Number},
    "code"            :{type:String},
    "name"            :{type:String},
    "value"           :{type:String},
    "createTime"      :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"      :{type:Date},
}, {
  versionKey: false,
  toJSON:{ getters: true }
})


//下面用自增插件，实现id的自增功能
configsSchema.plugin(autoIncrement.plugin, {
  model: 't_configs',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Configs',configsSchema,'t_configs')