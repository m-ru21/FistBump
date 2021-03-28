var router = require('express').Router();
var mongoose = require('mongoose');
var post = mongoose.model('post');

router.post('/asdas',function(req, res){

    var postInfo= req.body;
  
    getNextSequenceValue("postid", function(result)
    {
      savePost(postInfo,result);
    }
    );
  
    res.send(req.body);
    console.log(req.body.p_id);
  });
  
router.post('/asd/like_post', function(req, res){
    var postInfo= req.body;
    post.findOneAndUpdate({"p_id":postInfo.p_id},{"$push": {"likes": postInfo.u_id}}, {"new": true},function(err,x){
            post.aggregate([{$match: {p_id: postInfo.p_id}}, {$project: {likes: {$size: '$likes'}}}], function(err, docs){
            console.log(docs);
          });
      });
    })

router.get('/asda',function(req,res){
  posts.find(function(err, docs){
    if(err)
    console.log(err);
    else
    res.send(docs);
  })
})

module.exports = router;