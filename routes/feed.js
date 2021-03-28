var router = require('express').Router();
var mongoose = require('mongoose');
var post = mongoose.model('post');
var counter = mongoose.model('counter')
var areas_of_interest = mongoose.model('areas_of_interest')
var user = mongoose.model('user')
var multer = require('multer')
var fs = require('fs');
var upload = multer(
    { 
        limits: {
            fieldNameSize: 999999999,
            fieldSize: 999999999
        },
        dest: '/public/images/' }
    );
var os = require( 'os' );

router.post('/create_post',function(req, res){

    var postInfo= req.body;
  
    counter.getNextSequenceValue("postid", function(result)
    {
      post.savePost(postInfo,result);
    }
    );
  
    res.send(req.body);
    console.log(req.body.p_id);
  });
  
router.post('/get_posts/like_post', function(req, res){
    var postInfo= req.body;
    post.findOne({"p_id":postInfo.p_id, "likes":postInfo.u_id}, function(err,doc){
      if(err)
      {
        console.log(err);
      }
      if(!doc)
      {
        post.findOneAndUpdate({"p_id":postInfo.p_id},{$push:{likes:postInfo.u_id},$inc:{likes_count:1}},function(err,result){
          res.send({"status":"success"});
        });
                
      }
      else
      {
        console.log(postInfo.p_id,postInfo.u_id);
        post.findOneAndUpdate( {"p_id": postInfo.p_id},{$inc:{likes_count:-1},$pullAll: { likes: [postInfo.u_id] }},function(err,result){
          res.send({"status":result});
        });
        
      }
    })
  
    })

router.get('/get_posts',function(req,res){
  post.find(function(err, docs){
    if(err)
    console.log(err);
    else
    res.send({articles:docs});
  })
})

router.get('/get_post/:aoi',function(req,res){
  var aoi = req.params.aoi;
  var pro1=areas_of_interest.findOne({'category': aoi})
  var pro2=pro1.catch(function(err){
        console.log(err);
    }).then(function(docs){
        console.log(docs);
        body=docs;
        console.log(body);
        return post.find({'aoi_id':body.aoi_id});
    })
    var pro4=pro2.then(function(docs){
      var sendObj=docs
      var sendObj=docs
      res.send({"posts":sendObj});
    })
})

router.post('/get_aoi',function(req,res){
  var a = req.body.aoi;
  console.log("userid:" + a);
  user.aggregate([
    {
      $match:
      {
        u_id : parseInt(a)
      }
    },
    {
      $unwind: "$aoi_id"
    },
    {
       $lookup:
          {
             from: "areas_of_interests",
             localField: "aoi_id",
             foreignField: "aoi_id",
             as: "registeredEvents_docs"
         }
    },
    { $group: {
      "_id": "$_id",
      "registeredEvents_docs": { "$push": {
          "aoi_id": "$registeredEvents_docs.aoi_id",
          "category": "$registeredEvents_docs.category",
      }}}},
    
  {
    $project:
    {
      "registeredEvents_docs":1
    }
  }],function(err, response)
    {
      if(err) 
      console.log(err);
      else
      {
        console.log(response);
        response[0].registeredEvents_docs.forEach(element => {
          element.aoi_id = element.aoi_id[0];
          element.category = element.category[0];  
        })
        console.log("final response" + response[0].registeredEvents_docs)
        res.send({"Aoi":response[0].registeredEvents_docs});
      }

    })
})

router.get('/get_all_aoi',function(req,res){
  areas_of_interest.find(function(err, docs){
    if(err)
    console.log(err);
    else
    res.send({"Aoi":docs});
  })
})

router.post('/upload', upload.any(), function(req, res){

  console.log(req.files);
  var networkInterfaces = os.networkInterfaces();
  var tmp_path = req.files[0].path;
  var target_path = 'uploads/' + req.files[0].originalname;
  var original_path = "http://" + networkInterfaces['Wi-Fi'][1]['address'] + ":3000/static/" + req.files[0].originalname; 
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() { res.json({"path":original_path}); });
  src.on('error', function(err) { res.send({"status": "upload failed"}); });
});

router.get('/ip',function(req,res){
  
});

module.exports = router;