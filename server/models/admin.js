var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment')

var Schema = mongoose.Schema;

var adminSchema = new Schema({
    "_id"         :{type:Number},
    "username"    :{type:String},
    "password"    :{type:String},
    "nickname"    :{type:String},
    "createTime"    :{type:Date,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')},
    "updateTime"  :{type:Date}
}, {
  versionKey: false,
  toJSON:{ getters: true }
})

//下面用自增插件，实现id的自增功能
adminSchema.plugin(autoIncrement.plugin, {
  model: 't_admin',
  field: '_id',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Admin',adminSchema,'t_admin')