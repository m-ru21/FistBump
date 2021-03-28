var mongoose = require('mongoose')

var aoiSchema=mongoose.Schema({
    aoi_id:{type:Number},// ref:['users','posts', 'events', 'influencers']},
    category: String
  })
  module.exports = mongoose.model('areas_of_interest', aoiSchema);
  