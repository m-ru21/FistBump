var router = require('express').Router();
var mongoose = require('mongoose');
var promise=require('promise');
var event = mongoose.model('event');
var counter = mongoose.model('counter');
var influencer = mongoose.model('influencer');
var user = mongoose.model('user');

router.post('/create_event',function(req,res){
    var eventInfo=req.body;
    counter.getNextSequenceValue("eventid",function(result){
     event.saveEvent(eventInfo,result);
    });
  
  })
  
  router.get('/get_events', function(req,res){
    //var aoi_id=req.body;
    var date=new Date();
   // var eventDoc,name;
   event.find( {'e_specifications.event_date':{$gt:date.toISOString().substring(0,10)}},{'e_specifications':1,'e_id':1}, function(err, docs){
      if(err) console.log(err);
      else 
      {
        if(docs==null)
        {
        console.log(docs);
        res.send("no events");
        }
       else{
        res.json({"events":docs});
        console.log(docs);
      }
      }
    });

   /*var pro1= event.find( {'e_specifications.event_date':{$gt:date.toISOString().substring(0,10)}},{'e_specifications':1,'e_id':1,'i_id':1})
   var pro2=pro1.then(function(docs){
     eventDoc=docs;
     console.log(docs);
     console.log("dewkhdkw");
     return influencer.find({'i_id':docs.i_id})
    })
    var pro3=pro2.then(function(doc){
      
      console.log(doc.u_id);
      console.log("dewkhdkw");
      return user.findOne({'u_id':doc.u_id})
    })
    var pro4=pro3.then(function(doc){
      console.log("dewkhdkw");
      console.log(doc);
      name=doc.username;
      console.log(doc.username);
      sendObj={eventDoc,name};
      res.send(sendObj);
    })*/
  });
  
  
  router.post('/get_events/get_eventdetails',function(req,res){
    var registrationDetails=req.body;
    var body,sendObj,name;
    var pro1=event.findOne({'e_id':registrationDetails.e_id})
    var pro2=pro1.catch(function(err){
        console.log(err);
    })
        .then(function(docs){
        console.log(docs);
        body=docs;
      return influencer.findOne({'i_id':docs.i_id});
     
    })
      var pro3=pro2.catch(function(err){
      console.log(err);
  })
    .then(function(docs){
      console.log(docs);
      return user.findOne({'u_id':docs.u_id});
     })
     var pro4=pro3.then(function(docs){
     name=docs.username;
     sendObj={body,name};
     res.send(sendObj);
     })
  })
  
  router.post('/get_events/get_eventdetails/register_event',function(req,res)
  {
    var registrationDetails=req.body;
    var date=new Date();
    event.findOneAndUpdate({$and:[{'e_id':registrationDetails.e_id},{'e_specifications.deadline_date':{$gte:date.toISOString().substring(0,10)}}]},
      { "$push": { "u_id": registrationDetails.u_id } },
      { "new": true, "upsert": false },
      function (err, docs) {
          if (err) throw err;
          console.log("******** event doc : *********"+docs);
         if(docs==null)
         res.send("no");
         else
         {
          user.findOneAndUpdate({'u_id':registrationDetails.u_id},
          { "$push": { "e_id": registrationDetails.e_id } },
          { "new": true, "upsert": true },
          function (err, docs) {
              if (err) throw err;
              console.log("******** user  doc : *********"+docs);
          }
        );
          res.send("yes");
         } 
      }
    
    );
  });
  
  router.get('/get_today_events',function(req,res){
    var date=new Date();
    
  console.log(date.toISOString().substring(0,10));
  console.log(date.toString()); 
  event.find({'e_specifications.event_date':date.toISOString().substring(0,10)},function(err,response){
  res.send(response);
    })
  })
  
  router.post('/get_today_events/get_eventdetails',function(req,res){
    var registrationDetails=req.body;
    var body,sendObj,name;
    var pro1=event.findOne({'e_id':registrationDetails.e_id})
    var pro2=pro1.catch(function(err){
        console.log(err);
    })
        .then(function(docs){
        console.log(docs);
        body=docs;
      return influencer.findOne({'i_id':docs.i_id});
     
    })
      var pro3=pro2.catch(function(err){
      console.log(err);
  })
    .then(function(docs){
      console.log(docs);
      return user.findOne({'u_id':docs.u_id});
     })
     var pro4=pro3.then(function(docs){
     name=docs.username;
     sendObj={body,name};
     res.send(sendObj);
     })
  })
  
  router.post('/get_today_events/get_eventdetails/register_event',function(req, res){
    var registrationDetails=req.body;
    var date=new Date();
    event.findOneAndUpdate({$and:[{'e_id':registrationDetails.e_id},{'e_specifications.deadline_date':{$gte:date.toISOString().substring(0,10)}}]},
      { "$push": { "u_id": registrationDetails.u_id } },
      { "new": true, "upsert": false },
      function (err, docs) {
          if (err) throw err;
          console.log("******** event doc : *********"+docs);
         if(docs==null)
         res.send("no");
         else
         {
          user.findOneAndUpdate({'u_id':registrationDetails.u_id},
          { "$push": { "e_id": registrationDetails.e_id } },
          { "new": true, "upsert": true },
          function (err, docs) {
              if (err) throw err;
              console.log("******** user  doc : *********"+docs);
          }
        );
          res.send("yes");
         } 
      }
  );
    });
  
module.exports = router;