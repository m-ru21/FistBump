var mongoose = require('mongoose')

//Events collection schema
var eventsSchema=mongoose.Schema({
    i_id:{type: Number},// ref: 'influencer'},
    u_id:[{type: Number}], //ref: 'user'}],
    e_id:{type: Number}, //ref:['notification', 'user']},
    e_specifications:
    {
      location: String,
      fees: Number,
      event_date: String,
      e_name:String,
      event_post_date:Date,
      deadline_date:String,
      aoi_id:Number,// ref:'areas_of_interest'},
      e_image:String,
      details:String
    }
  })

  eventsSchema.statics.saveEvent = function(eventInfo,count)
  {
    var newEvent=new this({
      i_id:eventInfo.i_id,
      e_id:count,
      e_specifications:
      {
        location: eventInfo.e_specifications.location,
        fees: eventInfo.e_specifications.fees,
        event_date: eventInfo.e_specifications.event_date,
        e_name: eventInfo.e_specifications.e_name,
        event_post_date:Date.now(),
        deadline_date:eventInfo.e_specifications.deadline_date,
        aoi_id:eventInfo.e_specifications.aoi_id,
        e_image:eventInfo.e_specifications.e_image,
        details:eventInfo.e_specifications.details
      }
    });
    newEvent.save(function(err, event){
      if(err) console.log(err);
      else console.log("event added....");
    });
  };

  module.exports = mongoose.model('event', eventsSchema);
  