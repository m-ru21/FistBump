var router = require('express').Router();
var mongoose = require('mongoose');
var user = mongoose.model('user');
var influencer = mongoose.model('influencer');
var post = mongoose.model('post');
router.post('/get_my_posts',function(req,res)
{
  post.find({'i_id':req.body.u_id},function(err, docs){
    if(err)
    console.log(err);
    else
    {
      console.log(docs);
    res.send({"posts":docs});
    }
  })
  /*var pro1=influencer.findOne({'u_id':req.body.u_id})
  var pro3=pro1.then(function(doc){
    influencer.aggregate([
      {$lookup: {from:"posts",localField: "i_id",foreignField:"i_id",as: "posts_docs"}},{$match:{"posts_docs.i_id":doc.i_id}}],function(err,doc){
      if(err) 
      console.log(err);
      else
      {
      res.json({"my_posts":doc});
      console.log(doc);
      }
    })
  })*/
})

router.post('/get_my_events/separate', function(req,res){

  var posted_events,registeredto_events;
 
  var pro1=user.findOne({'u_id':req.body.u_id})
 .then(function(doc)
 {
     console.log("pro1"+doc+"\n**********");
     if(doc.is_influencer)
      return influencer.findOne({'u_id':doc.u_id});
     else
     return "no influencer";
   })
  var pro2=pro1.then(function(doc){
            console.log("pro2"+doc+"\n**********");
            if(doc=="no influencer")
            return "no influencer";
            else
            return  influencer.aggregate([
             {$lookup: {from:"events",localField: "i_id",foreignField:"i_id",as: "events_docs"}},{$match:{"events_docs.i_id":doc.i_id}}])
            })
      
 var pro3=pro2.then(function(doc){
   console.log("pro3"+doc+"\n**********");
               //console.log(doc);
               if(doc!="no influencer")
               posted_events=doc;
             //console.log(doc);
          })
 
  var pro4=pro3.then(function(){
          return user.aggregate([
          {
           $unwind: "$e_id"
          },
          {
            $lookup:
               {
                  from: "events",
                  localField: "e_id",
                  foreignField: "e_id",
                  as: "registeredEvents_docs"
              }
          },
         {
           $match:
           {
             "registeredEvents_docs.u_id":req.body.u_id
           }
         }])})
         
        var pro5=pro4.then(function(doc){
               registeredto_events=doc;
           var body={posted_events,registeredto_events};
           res.json({"my_events":body});
           //console.log(response);
           })
 })
 

router.post('/get_my_events', function(req,res){
  var id=req.body.u_id;
  user.findOne({'u_id':id},function(err, doc){
    if(err) 
    console.log(err);
    else
    {
      user.aggregate([
     {
      $unwind: "$e_id"
     },
     {
       $lookup:
          {
             from: "events",
             foreignField: "e_id",
             localField: "e_id",
             as: "registered_docs"
         }
     },
    {
      $project:{ "registered_docs":1}
    }], function(err, doc){
      if(err)
      console.log(err);
      else{
       
            res.json({"reg":doc});
       
      }
    });
  }
  
})
})

router.post('/get_my_profiledetails',function(req,res){

  /*user.findOne({'u_id':req.body.u_id},function(err,doc){
    if(err)
    console.log(err);
    else
    res.send(doc);
  })*/

  user.findOne({'u_id':req.body.u_id},function(err,doc){
    if(err)
    console.log(err);
    else
    {
      console.log(doc);
      if(doc.is_influencer)
      {
        console.log("insisw");
        user.aggregate([
         {$lookup: 
          {from:"influencers",
          localField: "u_id",
          foreignField:"u_id",
          as: "connectionDocs"
        }},
        {
          $match:{"connectionDocs.u_id":doc.u_id}
        }   
      ],function(err, doc){
          console.log("djewkhfkewhfk");
          console.log(doc);
          res.json({"profile_data":doc});
          //return;
        })
      }
      else
      res.json({"profile_data":[doc]});
    }
  
})
});

router.post('/get_my_profiledetails/get_followers_and_followings',function(req,res){
  var followers_doc,following_doc,userDoc;

 var pro1=user.findOne({'u_id':req.body.u_id})
.then(function(doc)
{
  userDoc=doc;
  console.log("pro1"+doc+"\n**********");
    if(doc.is_influencer)
     return influencer.findOne({'u_id':doc.u_id});
    else
    return "no influencer";
  })
 var pro2=pro1.then(function(doc){
           console.log("pro2"+doc+"\n**********");
           if(doc=="no influencer")
           return "no influencer";
           else
           return  influencer.aggregate([
             {$unwind:"$followers"},
            {$lookup: {from:"users",localField: "followers",foreignField:"u_id",as: "followers_docs"}},{$match:{"followers_docs.following":doc.i_id}}])
           })
     
var pro3=pro2.then(function(doc){
  console.log("pro3"+doc+"\n**********");
              //console.log(doc);
              if(doc!="no influencer")
              followers_doc=doc;
            //console.log(doc);
         })

 var pro4=pro3.then(function(){

          console.log("pro4...."+userDoc);
         return user.aggregate([
         {
          $unwind: "$following"
         },
         {
           $lookup:
              {
                 from: "influencers",
                 localField: "following",
                 foreignField: "i_id",
                 as: "followings_docs"
             }
         },
        {
          $match:
          {
            "followings_docs.i_id":{$in:userDoc.following}
          }
        }])})
        
       var pro5=pro4.then(function(doc){
              following_doc=doc;
          var body={followers_doc,following_doc};
          res.send(body);
          //console.log(response);
          })
})


router.post('/follow',function(req,res){
    var ids_obj=req.body;
    user.findOneAndUpdate({'u_id':ids_obj.u_id},
      { "$push": { "following": ids_obj.i_id } },
      { "new": true, "upsert": true },
      function (err, docs) {
          if (err) throw err;
          console.log("******** User doc : *********"+docs);
      }
    );
    influencer.findOneAndUpdate({'i_id':ids_obj.i_id},
      { "$push": { "followers": ids_obj.u_id } },
      { "new": true, "upsert": true },
      function (err, docs) {
          if (err) throw err;
          console.log("******** Influencer doc : *********"+docs);
      }
    );
    })
    
module.exports = router;