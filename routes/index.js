var router = require('express').Router();
var mongoose = require('mongoose')
router.use('/feed', require('./feed'));
router.use('/search', require('./search'));
router.use('/event', require('./event'));
router.use('/notification', require('./notification'));
router.use('/profile', require('./profile'));
router.use('/setting', require('./setting'));
router.use('/user', require('./user'));

router.get('/',function(req,res){
  return res.send("Hello world");
});

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;