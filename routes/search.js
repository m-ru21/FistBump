var router = require('express').Router();
var mongoose = require('mongoose');
var post = mongoose.model('post');
var user = mongoose.model('user');
var counter = mongoose.model('counter');
var influencer = mongoose.model('influencer');



router.post('/creattyute_post',function(req, res){

    var postInfo= req.body;
  
    getNextSequenceValue("postid", function(result)
    {
      savePost(postInfo,result);
    }
    );
  
    res.send(req.body);
    console.log(req.body.p_id);
  });
  
router.post('/gexczt_posts/like_post', function(req, res){
    var postInfo= req.body;
    post.findOneAndUpdate({"p_id":postInfo.p_id},{"$push": {"likes": postInfo.u_id}}, {"new": true},function(err,x){
            post.aggregate([{$match: {p_id: postInfo.p_id}}, {$project: {likes: {$size: '$likes'}}}], function(err, docs){
            console.log(docs);
          });
      });
    })

router.get('/gxxet_posts',function(req,res){
  posts.find(function(err, docs){
    if(err)
    console.log(err);
    else
    res.send(docs);
  })
})

router.post('/search1',function(req,res){
  user.find({
    "$text": {
      "$search": req.body.query
    },function (err,doc) {
      res.json(doc);
    }

})
})





module.exports = router;