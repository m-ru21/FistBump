var mongoose = require('mongoose')

var postSchema=mongoose.Schema({
    p_id:{type: Number},// ref: 'notification'},  
    p_type: Number,
    p_title:String,
    p_content:String,
    p_image: String,
    aoi_id: {type: Number},// ref: 'areas_of_interest'},
    i_id:{type: Number}, //ref: 'influencer'},
    likes:
    [{
    type:Number, //ref:'user' ,
    }],
    likes_count:{type:Number, default:0},
    comments:
    [{
      u_id:{type: Number},// ref:'users'},
      text:String
    }]
  })

postSchema.statics.savePost = function(postInfo,count){
  var newPost = new this({  
  p_type: postInfo.p_type,
  p_id:count,
  p_title:postInfo.p_title,
  p_image:postInfo.p_image,
  p_content:postInfo.p_content,
  post_date: Date.now(),
  aoi_id: postInfo.aoi_id,
  i_id: postInfo.i_id,
  });
   newPost.save(function(err, post){
    if(err)
      console.log("Database error"+err);
    else
      console.log("New post added");
  });
};

module.exports = mongoose.model('post', postSchema);
  