var mongoose = require('mongoose')
require('./Influencer')
require('./Post')
require('./Notification')
require('./Event')
var userSchema = mongoose.Schema({
     username: {type:String, required:true},
     password: {type:String, required:true},
     u_id: {type: Number},// ref:['influencer','post','notification','event']},
     image_link:String,
     is_influencer:Boolean,
     college:{type:String, required:true},
     email:{type:String, required:true},
     aoi_id:[{type:Number}],// ref: 'areas_of_interest'}],
     following: [{type:Number}],// ref:'influencer'}],
     e_id: [{type: Number}], //ref: 'event'}]
   });

userSchema.statics.saveUser = function(personInfo,count){
  var newPerson = new this({
    username: personInfo.username,
    password: personInfo.password,
    u_id: count,
    image_link:personInfo.image_link,
    is_influencer:personInfo.is_influencer,
    college:personInfo.college,
    email:personInfo.email,
    aoi_id:personInfo.aoi_id,
    following: personInfo.following,
    e_id: personInfo.e_id
   });
   newPerson.save(function(err, user){
    if(err)
      console.log("Database error"+err);
    else
      console.log("New person added");
  });
};

module.exports = mongoose.model("user",userSchema);

