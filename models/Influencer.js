var mongoose = require('mongoose')
require('./User')
//Influencers collection schema
var influencerSchema=mongoose.Schema({
    u_id: {type:Number},// ref:['user']},
    i_id: {type:Number}, //ref:['notification', 'event','post']},
    followers: [{type:Number}],// ref:'user' }],
  })

influencerSchema.statics.saveInfluencer = function(personInfo,count,userid)
{
  var newInfluencer = new this({
    u_id:userid,
    i_id:count,
    followers:personInfo.followers
});
newInfluencer.save(function(err, influencer){
  if(err) 
    console.log(err);
    else console.log("New influencer added");
})
};

module.exports = mongoose.model('influencer',influencerSchema);
  