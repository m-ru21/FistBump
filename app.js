var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express();

// view engine setup
    

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const router = express.Router();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'uploads')))
mongoose.connect('mongodb://localhost:27017/EventApp', { useNewUrlParser: true })

require('./models/User');
require('./models/Post');
require('./models/Influencer');
require('./models/Event');
require('./models/Interest');
require('./models/Notification');
require('./models/Counter');
//app.use(require('./routes'))

//app.use(require('./routes/user'))(router);
app.use(require('./routes'))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
port = 3000
app.listen(port, () => console.log(`Listening on port ${port}!`))
module.exports = app;
