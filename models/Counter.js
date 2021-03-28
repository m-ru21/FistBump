var mongoose = require('mongoose')

var counterschema=mongoose.Schema({
    _id:String,
    sequence_value:Number
  });
  
counterschema.statics.getNextSequenceValue = function(sequenceName, callback){
  var count;
  console.log("in get");
  this.findByIdAndUpdate(sequenceName,{$inc: {sequence_value:1}},{returnNewDocument: true},function(err, docs){
  if(err)
  console.log(err);
  else 
  {
    console.log("incremented"+docs.sequence_value);
    count=   docs.sequence_value;
   }
   callback(count);
  } );
};
  
module.exports = mongoose.model('counter', counterschema);
  