var mongoose = require('mongoose')

//Notifications collection schema
var notificationSchema=mongoose.Schema({
    u_id:{type: Number},// ref:'user'},
    p_id:{type: Number},// ref:'post'},
    e_id:{type: Number},// ref: 'event' },
    i_id:{type: Number}, //ref: 'influencer'},
    text: String
  })
  module.exports = mongoose.model('notification', notificationSchema);
  